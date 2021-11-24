/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package in.raster.ioviyam2.servlets;

import java.awt.image.BufferedImage;
import java.awt.image.DataBufferUShort;
import java.awt.image.Raster;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;

import org.dcm4che2.data.DicomElement;
import org.dcm4che2.data.DicomObject;
import org.dcm4che2.data.Tag;
import org.dcm4che2.imageio.plugins.dcm.DicomStreamMetaData;
import org.dcm4che2.imageioimpl.plugins.dcm.DicomImageReaderSpi;
import org.dcm4che2.io.DicomOutputStream;

import ij.process.ImageProcessor;
import ij.process.ShortProcessor;
/**
 *
 * @author prasath
 */
public class ImageScaleProceesor {
    int scaleWidth = 512;
    int scaleHeight = 512;
    ByteArrayOutputStream buffer = null;
    BufferedImage resizedImg;

    public File dicomData(File inputDicom) throws IOException {
        File OutputDicom = File.createTempFile("Dicom12", ".dcm");
        try {
            ImageReader reader = new DicomImageReaderSpi().createReaderInstance();
//            FileImageInputStream input = new FileImageInputStream(inputDicom);
            ImageInputStream iis = ImageIO.createImageInputStream(inputDicom);
            reader.setInput(iis, false);

            DicomStreamMetaData streamMeta = (DicomStreamMetaData) reader.getStreamMetadata();
            DicomObject dicom = streamMeta.getDicomObject();
            org.dcm4che2.imageio.plugins.dcm.DicomImageReadParam param = (org.dcm4che2.imageio.plugins.dcm.DicomImageReadParam) reader.getDefaultReadParam();
            Raster raster = reader.readRaster(0, param);
            if (raster == null) {
                System.out.println("Error: couldn't read Dicom image!");
                return null;
            }
            iis.close();
            DataBufferUShort buffer = (DataBufferUShort) raster.getDataBuffer();
            short[] pixelData = buffer.getData();
           
            DicomElement ht = dicom.get(Tag.Rows);
            int height = ht != null ? ht.getInt(false) : 0;
            DicomElement wt = dicom.get(Tag.Columns);
            int width = ht != null ? wt.getInt(false) : 0;
            int megaPixels = (height * width) / (1024 * 1024);
            if (megaPixels < 2) {
                return null;
            }
            DicomElement pixelSpacingEle = dicom.get(Tag.PixelSpacing);
            String pixelSpacing = pixelSpacingEle != null ? new String(pixelSpacingEle.getBytes()) : "";
            pixelData = scale(pixelData, width, height);
            dicom.putShorts(Tag.PixelData, dicom.vrOf(Tag.PixelData), pixelData);
            dicom.putInt(Tag.Rows, dicom.vrOf(Tag.Rows), scaleHeight);
            dicom.putInt(Tag.Columns, dicom.vrOf(Tag.Columns), scaleWidth);

//            dicom.putInt(Tag.Rows, dicom.vrOf(Tag.Rows), 500);
//            dicom.putInt(Tag.Columns, dicom.vrOf(Tag.Columns), 500);
            String pxlvalue;
            try {
                String[] pxlspacing = pixelSpacing.split("\\\\");
                Double d1 = 0.0;
                Double d2 = 0.0;
                if(pxlspacing[0] != null && !pxlspacing[0].isEmpty())
                	d1 = Double.parseDouble(pxlspacing[0]);
                if(pxlspacing.length > 1 && pxlspacing[1] != null && !pxlspacing[1].isEmpty())
                	d2 = Double.parseDouble(pxlspacing[1]);
                pxlvalue = (d1 * 3.8 + "\\" + d2 * 3.8);
            } catch (NullPointerException f) {
                pxlvalue = "";
            }

            dicom.putString(Tag.PixelSpacing, dicom.vrOf(Tag.PixelSpacing), pxlvalue);
            return genFile(dicom);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error: couldn't read dicom image! " + e.getMessage());
            return null;
        }

//        boolean deleted = false;
//        try {
//            deleted = inputDicom.delete();
//        } catch (SecurityException e) {
//            e.printStackTrace();
//        }
//        // else delete the file when the program ends
//        if (deleted) {
////            System.err.println("Temp file deleted.");
//        } else {
//            inputDicom.deleteOnExit();
//            System.err.println("Temp file scheduled in dicom 1 **** for deletion.");
//        }
//        return OutputDicom;
    }

    public File genFile(DicomObject obj) throws IOException {
        File tempFile = File.createTempFile("Dicomcompressedfile", ".dcm");
        File reFile = tempFile;
        FileOutputStream fos = null;
        try {
            fos = new FileOutputStream(reFile);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        BufferedOutputStream bos = new BufferedOutputStream(fos);
        DicomOutputStream dos = new DicomOutputStream(bos);
        try {
            dos.writeDicomFile(obj);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                dos.close();
            } catch (IOException ignore) {
            }
        }
        return reFile;
    }

    public short[] scale(short[] fileData1, int width, int height) throws IOException {
        ShortProcessor ij = new ShortProcessor(width, height, fileData1, null);
        scaleHeight = (int) (height / 3.8);
        scaleWidth = (int) (width / 3.8);
        BufferedImage src = ij.getBufferedImage();
        ImageProcessor ip = ij.resize(scaleWidth, scaleHeight);
        Object oj = ip.getPixels();
        short[] srt = (short[]) oj;
        return srt;
    }

    public static void main(String[] args) {
        ImageScaleProceesor s = new ImageScaleProceesor();
        try {
            s.dicomData(new File("/home/prasath/a/ccc.dcm"));
        } catch (IOException ex) {
            Logger.getLogger(ImageScaleProceesor.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
