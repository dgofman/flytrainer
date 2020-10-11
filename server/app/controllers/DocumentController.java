package controllers;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Date;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.TimeUnit;

import com.fasterxml.jackson.databind.JsonNode;

import io.ebean.Ebean;
import io.ebean.Query;
import models.BaseModel;
import models.Document;
import models.User;
import play.libs.Files.DelegateTemporaryFile;
import play.mvc.Http;
import play.mvc.Http.MultipartFormData.FilePart;
import play.mvc.Result;
import utils.AppConfig;
import utils.BasicAuth;
import utils.Constants;
import utils.Constants.Access;
import utils.Constants.Key;

@BasicAuth({ Access.ASSISTANT, Access.MANAGER, Access.ADMIN })
public class DocumentController extends BaseController {

	private static final JsonNode DOCUMENTS_SAVE_PATH = AppConfig.get(Key.DOCUMENTS_SAVE_PATH);
	private static final JsonNode CLEANUP_TEMP_TIME = AppConfig.get(Key.CLEANUP_TEMP_TIME);

	public static final File tempDir;
	public static final File savedDir;

	static {
		tempDir = new File("../tmp_files");
		tempDir.mkdirs();
		
		if (!DOCUMENTS_SAVE_PATH.isNull() && !DOCUMENTS_SAVE_PATH.asText().isBlank()) {
			savedDir = new File(DOCUMENTS_SAVE_PATH.asText());
			savedDir.mkdirs();
		} else {
			savedDir = null;
		}
		if (!CLEANUP_TEMP_TIME.isNull() && CLEANUP_TEMP_TIME.asLong() != 0) {
			Timer time = new Timer();
			long timeout = CLEANUP_TEMP_TIME.asLong();
			time.schedule(new TimerTask() {
				@Override
				public void run() {
					long cutOff = System.currentTimeMillis() - (timeout * 1000);
					try {
						Files.list(tempDir.toPath()).filter(path -> {
							try {
								return Files.isRegularFile(path)
										&& Files.getLastModifiedTime(path).to(TimeUnit.MILLISECONDS) < cutOff;
							} catch (IOException e) {
								return false;
							}
						}).forEach(path -> {
							try {
								Files.delete(path);
							} catch (IOException e) {
								e.printStackTrace();
							}
						});
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			}, 0, 60000);
		}
	}

	public Result saveFile(Http.Request request, Long userId) {
		log.debug("DocumentController::saveFile for user=" + userId);
		try {
			Http.MultipartFormData<DelegateTemporaryFile> body = request.body().asMultipartFormData();
			FilePart<DelegateTemporaryFile> part = body.getFile("file");
			if (part != null) {
				File file = new File(tempDir, userId + "_" + new Date().getTime() + "_" + part.getFilename());
				DelegateTemporaryFile tempFile = part.getRef();
				tempFile.moveTo(file);
				return okResult(file.getCanonicalPath());
			}
			return badRequest(new Exception("File - part is missing"));
		} catch (Exception e) {
			return badRequest(e);
		}
	}

	public Result getDocuments(Long userId, Integer offset) {
		log.debug("DocumentController::getDocuments for user=" + userId);
		try {
			Query<Document> query = Ebean.createQuery(Document.class).setParameter("userId", userId);
			int rows = 25;
			int total = query.findCount();
			List<Document> documents = query.setFirstRow(offset).setMaxRows(rows).findList();
			return okResult(new TableResult(offset, total, documents), BaseModel.Short.class);
		} catch (Exception e) {
			return badRequest(e);
		}
	}

	public Result getFile(Long userId, Long docId) {
		log.debug("DocumentController::getFile for user=" + userId + ", docId=" + docId);
		try {
			Query<Document> query = Ebean.createNamedQuery(Document.class, Document.FIND)
					.setParameter("user", new User(userId))
					.setParameter("id", docId);
			Document document = query.findOne();
			if (document == null) {
				return createBadRequest("nodocument", Constants.Errors.ERROR);
			}
			File file = null;
			if (document.filePath != null && (file = new File(document.filePath)) != null) {
				return ok(file).as(document.contentType).withHeader(CACHE_CONTROL, "max-age=3600").withHeader(CONNECTION, "keep-alive");
			} else if (document.file != null) {
				return ok(document.file).as(document.contentType).withHeader(CACHE_CONTROL, "max-age=3600").withHeader(CONNECTION, "keep-alive");
			} else {
				return notFound();
			}
		} catch (Exception e) {
			return badRequest(e);
		}
	}
	
	public Result getDocument(Long userId, Long docId) {
		log.debug("DocumentController::getDocument for user=" + userId + ", docId=" + docId);
		try {
			Query<Document> query = Ebean.find(Document.class);
			query.where().eq("user", new User(userId)).eq("id", docId);
			Document document = query.findOne();
			if (document == null) {
				return createBadRequest("nodocument", Constants.Errors.ERROR);
			}
			return okResult(document, BaseModel.Full.class);
		} catch (Exception e) {
			return badRequest(e);
		}
	}
}
