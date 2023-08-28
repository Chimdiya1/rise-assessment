import { IFileService } from "../../../interfaces/services.interfaces";
import FileController from "../../../controllers/file.controller";
import { Request, Response } from "express";
import { reqWithUser } from "../../../utils/types";

describe("File controller", () => {
  const mockFileService: IFileService = {
    create: jest.fn(),
    download() {
      return Promise.resolve(undefined);
    },
    flagAsUnsafe:jest.fn()
  };

  let fileController = FileController(mockFileService);

  const mockReq = {
    body: {
      filname: "test",
    },
    user:{
        id:""
    }
  } as unknown as reqWithUser;

  const mockRes = {
    status() {
      return this;
    },
    attachment: jest.fn(),
    send: jest.fn(),
  } as unknown as Response;

  beforeEach(() => {});

  it("Should call download file service  function", async () => {
    const downloadSpy = jest.spyOn(mockFileService, "download");
    await fileController.download(mockReq, mockRes);
    expect(downloadSpy).toHaveBeenCalled();
    expect(mockRes.send).toHaveBeenCalled();
    expect(mockRes.send).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.any(String),
      })
    );
  });
});
