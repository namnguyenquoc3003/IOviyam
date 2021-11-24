package in.raster.ioviyam2.servlets;
/*
 * To change this template, choose Tools | Templates and open the template in
 * the editor.
 */

import in.raster.ioviyam2.core.MoveScu;
import in.raster.ioviyam2.services.Dcm2Dcm;
import in.raster.ioviyam2.services.DcmQR;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.URL;
import java.util.Properties;
import java.util.zip.DeflaterOutputStream;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.io.IOUtils;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.FileChannel;
import java.nio.channels.WritableByteChannel;
import java.util.Iterator;
import java.util.Locale;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.zip.GZIPOutputStream;
import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.plugins.jpeg.JPEGImageWriteParam;
import javax.imageio.stream.ImageInputStream;
import javax.imageio.stream.ImageOutputStream;
import javax.servlet.http.HttpSession;
import org.dcm4che2.data.DicomObject;
import org.dcm4che2.imageioimpl.plugins.dcm.DicomImageReaderSpi;

/**
 *
 * @author prasath
 */
//@WebServlet(name = "imageservlet", urlPatterns = {"/imageservlet"})
public class ImageServlet extends HttpServlet {

    String ae, host, port, wado, serverName, accNo, listner, listner_port;
    String type, cstoreDest;

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, Exception {
        boolean isgzip = false;
        boolean isjpeg2000 = false;
        boolean isWado = false;
        InputStream resultInStream = null;
        OutputStream resultOutStream = null;
        HttpURLConnection conn = null;
        File tempFile = null;
        String object;
        DicomObject scaledObject = null;
        File file = null;
        String frameNumber = "0";
        try {
            HttpSession session = request.getSession(true);
            Config.setSessionDirect(request);
            ae = (String) session.getAttribute("ae");
            host = (String) session.getAttribute("host");
            port = (String) session.getAttribute("port");
            wado = (String) session.getAttribute("wado");
            listner = (String) session.getAttribute("listener");
            listner_port = (String) session.getAttribute("listener_port");
            String encodings = request.getHeader("Accept-Encoding");
            String[] browserflags = encodings.split(",");
            for (int i = 0; i < browserflags.length; i++) {
                String string = browserflags[i];
                if (string.equalsIgnoreCase("gzip")) {
                    isgzip = true;
                    response.setHeader("Content-Encoding", "gzip");
                    response.setHeader("Vary", "Accept-Encoding");
                }
            }
            String imageURL = "";
            String study = request.getParameter("studyUID");
            String series = request.getParameter("seriesUID");
            object = request.getParameter("objectUID");
            type = request.getParameter("type");
//            String tnx = request.getParameter("tnx");
//            if (tnx.equalsIgnoreCase("1.2.840.10008.1.2.4.90")) {
//                isjpeg2000 = true;
//            }
            String framenumber = request.getParameter("framedata");

            try {
                frameNumber = request.getParameter("frameNumber");
            } catch (NullPointerException e) {
                frameNumber = "0";
            }

            if (frameNumber == null) {
                frameNumber = "0";
            }

            int rows, coloumns;
            try {
                rows = Integer.parseInt(request.getParameter("rows"));
                coloumns = Integer.parseInt(request.getParameter("coloumns"));
            } catch (Exception e) {
//                e.printStackTrace();
                rows = 500;
                coloumns = 500;
            }
            if (framenumber == null) {
                framenumber = "Empty";
            }
            File filelocation = new File(Config.getTmpdirPath().getParent());
            String location = filelocation.getAbsolutePath() + File.separator;
            Properties prop = Config.getProb();
            boolean isdicom = false;
            cstoreDest = Config.getTmpdirPath().getAbsolutePath() + File.separator + study;
            String filePresent = Config.getTmpdirPath().getAbsolutePath() + File.separator + study + File.separator + object;
            File isFileExist = new File(filePresent);

            if (prop.getProperty("query_type").toString().equals("WADO")) {
                isWado = true;

            }

            if (isFileExist.exists()) {
                file = isFileExist;

            } else if (isWado) {

                isWado = true;
                if (type == "dicom" || type.equalsIgnoreCase("dicom")) {
                    isdicom = true;
                    imageURL = "http://" + host + ":" + wado + "/wado?requestType=WADO&studyUID=" + study + "&seriesUID=" + series + "&objectUID=" + object + "&frameNumber=" + frameNumber + "&transferSyntax=1.2.840.10008.1.2" + "&contentType=application/dicom";
                } else if (!(framenumber.equals("Empty"))) {
                    imageURL = "http://" + host + ":" + wado + "/wado?requestType=WADO&studyUID=" + study + "&seriesUID=" + series + "&objectUID=" + object + "&frameNumber=" + framenumber + "&rows=" + rows + "&coloumns=" + coloumns;
                } else {
                    imageURL = "http://" + host + ":" + wado + "/wado?requestType=WADO&studyUID=" + study + "&seriesUID=" + series + "&objectUID=" + object + "&rows=" + rows + "&coloumns=" + coloumns;
                }

            } else if (prop.getProperty("query_type").toString().equals("CMOVE")) {
                String sopClassUID = request.getParameter("sopClassUID");
                String dcmUrl = "DICOM://" + ae + ":" + listner + "@" + host + ":" + port;

                String cmoveParam[] = new String[]{
                    dcmUrl,
                    "--dest", listner.trim(),
                    "--suid", study,
                    "--Suid", series,
                    "--iuid", object,
                    "--ts", "1.2.840.10008.1.2"
                };
                MoveScu.main(cmoveParam);
                isWado = false;
                file = new File(cstoreDest + File.separator + object);
                if (!file.exists()) {
                } else {
                }
            } else if (prop.getProperty("query_type").toString().equals("CGET")) {
                isWado = false;
                String srcUrl = ae + "@" + host + ":" + port;
                String sopClassUID = request.getParameter("sopClassUID");
                cstoreDest = Config.getTmpdirPath().getAbsolutePath() + File.separator + study;
                File cstoreFile = new File(cstoreDest);
                cstoreFile.mkdirs();
                String cgetParam[] = new String[]{srcUrl, "-L " + listner, "-cget", "-I", "-qStudyInstanceUID=" + study, "-qSeriesInstanceUID=" + series,
                    "-qSOPInstanceUID=" + object, "-cstore", sopClassUID + ":1.2.840.10008.1.2.1", "-cstoredest", cstoreDest};
                DcmQR ds = new DcmQR(listner);
                ds.QueryDcm(cgetParam, listner);
            }
            if (isgzip) {
                resultOutStream = new GZIPOutputStream(response.getOutputStream());
            } else {
                resultOutStream = response.getOutputStream();
            }

            tempFile = File.createTempFile("DicomScale", ".dcm");
            try {
                if (isWado) {
                    // Initialize the URL for the requested image.
                    Thread.sleep(20);
                    URL imgURL = new URL(imageURL);
                    conn = (HttpURLConnection) imgURL.openConnection();
                    resultInStream = conn.getInputStream();

                    File filex = stream2file(resultInStream);
                    if (type == "dicom" || type.equalsIgnoreCase("dicom")) {

                        if (prop.getProperty("scaledown").equalsIgnoreCase("ON")) {
                            ImageScaleProceesor is = new ImageScaleProceesor();
                            if (is.dicomData(filex) != null) {
                                filex = (File) is.dicomData(filex);
                            }
                        }
                        if (prop.getProperty("jpeg2000").equalsIgnoreCase("ON")) {
                            file = File.createTempFile("DicomScalexxxc", ".dcm");
                            String dcm[] = new String[]{"-t", "1.2.840.10008.1.2.4.90", filex.getAbsolutePath(), file.getAbsolutePath()};
                            Dcm2Dcm.main(dcm);
                        } else if (prop.getProperty("jpeg2000").equalsIgnoreCase("OFF")) {
                            file = filex;
                        }

                    } else {
                        file = filex;
                    }
                    conn.disconnect();
                } else if ((type == "dicom" || type.equalsIgnoreCase("dicom")) && !isWado) {
                    File filetmpcmovecget = new File(cstoreDest + File.separator + object);
                    if (type == "dicom" || type.equalsIgnoreCase("dicom")) {
                        if (prop.getProperty("scaledown").equalsIgnoreCase("ON")) {
                            ImageScaleProceesor is = new ImageScaleProceesor();
                            if (is.dicomData(filetmpcmovecget) != null) {
                                filetmpcmovecget = (File) is.dicomData(filetmpcmovecget);
                            }
                        }
                        if (prop.getProperty("jpeg2000").equalsIgnoreCase("ON")) {
                            file = File.createTempFile("DicomScalexxxc", ".dcm");
                            String dcm[] = new String[]{"-t", "1.2.840.10008.1.2.4.90", filetmpcmovecget.getAbsolutePath(), file.getAbsolutePath()};
                            Dcm2Dcm.main(dcm);
                        } else if (prop.getProperty("jpeg2000").equalsIgnoreCase("OFF")) {
                            file = filetmpcmovecget;
                        }
                    } else {
                        file = filetmpcmovecget;
                    }
                } else if (!isWado && (type == "jpg" || type.equalsIgnoreCase("jpg"))) {
                    file = new File(cstoreDest + File.separator + object);
                    boolean fix = file.exists();
                    ImageReader reader = new DicomImageReaderSpi().createReaderInstance();
                    ImageInputStream iis = ImageIO.createImageInputStream(file);
                    reader.setInput(iis, false);
//                    org.dcm4che2.imageio.plugins.dcm.DicomImageReadParam param = (org.dcm4che2.imageio.plugins.dcm.DicomImageReadParam) reader.getDefaultReadParam();
                    BufferedImage bufferImage1 = reader.read(0);
                    File outputJpegFile = new File(file.getAbsolutePath() + ".jpg");
                    file = convertToJPG(outputJpegFile, bufferImage1);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            FileInputStream fIn = new FileInputStream(file);
            writeFileChannels(fIn, resultOutStream, file, tempFile);
        } finally {
        }
    }

    public File convertToJPG(File outputx, BufferedImage image) {
        File outputImage = outputx;
        try {
            ImageWriter imageWriter = null;
            Iterator<ImageWriter> iter = ImageIO
                    .getImageWritersByFormatName("jpg");
            if (iter.hasNext()) {
                imageWriter = iter.next();
            }
            ImageOutputStream ios = ImageIO.createImageOutputStream(outputImage);
            imageWriter.setOutput(ios);
            ImageWriteParam iwParam = new JPEGImageWriteParam(
                    Locale.getDefault());
            iwParam.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            iwParam.setCompressionQuality(1F);
            imageWriter.write(null, new IIOImage(convertToRGB(image), null,
                    null), iwParam);
            ios.flush();
            imageWriter.dispose();
            ios.close();

        } catch (IOException ex) {
            System.out.println(ex.getMessage());
        }
        return outputImage;
    }

    private BufferedImage convertToRGB(BufferedImage srcImage) {
        BufferedImage newImage = new BufferedImage(srcImage.getWidth(null),
                srcImage.getHeight(null), BufferedImage.TYPE_INT_BGR);
        Graphics bg = newImage.getGraphics();
        bg.drawImage(srcImage, 0, 0, null);
        bg.dispose();
        return newImage;
    }

    public static File stream2file(InputStream in) throws IOException {
        final File tempFile = File.createTempFile("Dicom", ".dcm");
        FileOutputStream out = new FileOutputStream(tempFile);
        IOUtils.copy(in, out);
        return tempFile;
    }
//      ??DEFLAT COMPRESSIONS------

    public static void writeFileChannels(FileInputStream fIn, OutputStream out, File file, File file2) throws IOException {
//        long time = System.currentTimeMillis();
        FileChannel fChan;
        long fSize;
        ByteBuffer mBuf;
        fChan = fIn.getChannel();
        fSize = fChan.size();
        mBuf = ByteBuffer.allocate((int) fSize);
        fChan.read(mBuf);
        mBuf.rewind();
        WritableByteChannel channel = Channels.newChannel(out);
        channel.write(mBuf);
        deleteFiles(file);
        deleteFiles(file2);
        fChan.close();
        fIn.close();
        out.close();
    }

    public static void deleteFiles(File file) {
        boolean deleted2 = false;
        try {
            deleted2 = file.delete();
        } catch (SecurityException e) {
            e.printStackTrace();
        }
        // else delete the file when the program ends
        if (deleted2) {
//            System.err.println("Temp file deleted.");
        } else {
            file.deleteOnExit();
//            System.err.println("Temp file2 scheduled for deletion.");
        }

    }
    public static final String PREFIX = "stream2file";
    public static final String SUFFIX = ".tmp";

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);

        } catch (Exception ex) {
            Logger.getLogger(ImageServlet.class
                    .getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);

        } catch (Exception ex) {
            Logger.getLogger(ImageServlet.class
                    .getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>
}
