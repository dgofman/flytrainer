package controllers;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.ebean.Ebean;
import io.ebean.Transaction;
import models.AbstractBase.Short;
import models.Certificate;
import models.User;
import play.libs.Json;
import play.mvc.Http;
import play.mvc.Result;
import utils.BasicAuth;
import utils.Constants;
import utils.Constants.Access;
import utils.Constants.CertificateType;
import utils.DocumentUtils;
import utils.NotesUtils;

@BasicAuth({ Access.ASSISTANT, Access.MANAGER, Access.ADMIN })
public class CertificateController extends BaseController {
	
	public Result findCFICertificates() {
		log.debug("CertificateController::findCFICertificates");
		try {
			List<SignedCFI> result = new ArrayList<>();
			List<CertificateType> types = Arrays.asList(CertificateType.values()).stream().filter(c -> c.isCFI()).collect(Collectors.toList());
			Ebean.find(Certificate.class).fetch("user", "first, last")
					.where().ne("isSuspended", 1).and().ne("isWithdrawn", 1).and().in("type", types)
					.order().asc("user.last")
					.findEach((Certificate c) -> {
						result.add(new SignedCFI(c));
					});
			return okResult(result);
		} catch (Exception e) {
			return badRequest(e);
		}
	}

	public Result getCertificate(Long userId) {
		log.debug("CertificateController::getCertificate for user=" + userId);
		try {
			List<Certificate> certificatees = Ebean.find(Certificate.class).where().eq("user", new User(userId)).findList();
			return okResult(certificatees, Short.class);
		} catch (Exception e) {
			return badRequest(e);
		}
	}

	public Result addCertificate(Http.Request request, Long userId) {
		log.debug("CertificateController::addCertificate for user=" + userId);
		User currentUser = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			User user = new User(userId);
			JsonNode body = request.body().asJson();
			Certificate certificate = Json.fromJson(body, Certificate.class);
			NotesUtils.create(certificate, user);
			DocumentUtils.create(certificate, user, currentUser);
			certificate.user = user;
			certificate.save(currentUser);
			transaction.commit();
			return okResult(certificate, Short.class);
		} catch (Exception e) {
			transaction.rollback();
			return badRequest(e);
		} finally {
			  transaction.end();
		}
	}

	public Result updateCertificate(Http.Request request, Long userId) {
		log.debug("CertificateController::updateCertificate for user=" + userId);
		User currentUser = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			User user = new User(userId);
			JsonNode body = request.body().asJson();
			Certificate certificate = Json.fromJson(body, Certificate.class);
			Certificate dbCertificate = Ebean.find(Certificate.class).where().eq("id", certificate.id).findOne();
			if (dbCertificate == null) {
				return createBadRequest("nocertificate", Constants.Errors.ERROR);
			}
			new ObjectMapper().readerForUpdating(dbCertificate).readValue(body);
			NotesUtils.update(dbCertificate, user, currentUser);
			DocumentUtils.update(dbCertificate, user, currentUser);
			dbCertificate.save(currentUser);
			transaction.commit();
			return okResult(dbCertificate, Short.class);
		} catch (Exception e) {
			transaction.rollback();
			return badRequest(e);
		} finally {
			  transaction.end();
		}
	}

	public Result deleteCertificate(Http.Request request, Long userId, Long certificateId) {
		log.debug("CertificateController::deleteCertificate id=" + certificateId + ", for user=" + userId);
		User currentUser = request.attrs().get(User.MODEL);
		Transaction transaction = Ebean.beginTransaction();
		try {
			Certificate dbCertificate = Ebean.find(Certificate.class).where().eq("id", certificateId).findOne();
			if (dbCertificate == null) {
				return createBadRequest("nocertificate", Constants.Errors.ERROR);
			}
			NotesUtils.delete(dbCertificate);
			DocumentUtils.delete(dbCertificate);
			dbCertificate.delete(currentUser);
			transaction.commit();
			return ok();
		} catch (Exception e) {
			transaction.rollback();
			return badRequest(e);
		} finally {
			  transaction.end();
		}
	}
}

class SignedCFI {
	public CertificateType type;
	public String cfiName;
	public String cfiNo;
	public Date expDate;
	public String other;
	
	public SignedCFI(Certificate c) {
		this.type = c.type;
		this.cfiName = c.user.last + " " + c.user.first;
		this.cfiNo = c.number;
		this.expDate = c.expDate;
		this.other = c.other;
	}
}