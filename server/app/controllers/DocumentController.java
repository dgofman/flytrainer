package controllers;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.TimeUnit;

import com.fasterxml.jackson.databind.JsonNode;

import play.libs.Files.DelegateTemporaryFile;
import play.mvc.Http;
import play.mvc.Http.MultipartFormData.FilePart;
import play.mvc.Result;
import utils.AppConfig;
import utils.Constants.Key;

public class DocumentController extends BaseController {

	private static final JsonNode DOCUMENTS_SAVE_PATH = AppConfig.get(Key.DOCUMENTS_SAVE_PATH);
	private static final JsonNode CLEANUP_TEMP_TIME = AppConfig.get(Key.CLEANUP_TEMP_TIME);

	public static final File tempDir;
	public static final File savedDir;

	static {
		tempDir = new File("../files");
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

}
