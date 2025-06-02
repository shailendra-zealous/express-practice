const { Client, ID, Storage } = require("node-appwrite")
const { InputFile } = require("node-appwrite/file")

const getStorage = async () => {
    const client = new Client().setEndpoint(process.env.APPWRITE_ENDPOINT)
        .setProject(process.env.APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);
    return new Storage(client);
}


const uploadFileAppwrite = async (fileObj) => {
    try {
        const fileName = fileObj.originalname;

        const storage = await getStorage();

        const inputFile = InputFile.fromBuffer(
            fileObj.buffer,
            fileName
        )

        const result = await storage.createFile(
            process.env.APPWRITE_BUCKET_ID,
            ID.unique(),
            inputFile
        );
        return result.$id;
    } catch (error) {
        return null;
    }
}

const deleteAppwriteFile = async (fileId) => {
    try {
        const storage = await getStorage();
        await storage.deleteFile(process.env.APPWRITE_BUCKET_ID, fileId);
    } catch (error) {
    }
}

const viewAppwriteFile = async (fileId) => {
    try {
        const storage = await getStorage();
        const file = await storage.getFilePreview(process.env.APPWRITE_BUCKET_ID, fileId)
        return file;
    } catch (error) {
        return null;
    }
}

module.exports = {
    uploadFileAppwrite,
    deleteAppwriteFile,
    viewAppwriteFile
}