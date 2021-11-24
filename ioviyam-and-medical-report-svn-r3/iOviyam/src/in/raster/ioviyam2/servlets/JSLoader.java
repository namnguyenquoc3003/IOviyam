/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// request URL
// <script src="JSLoader?EDITOR=yes&FileName=JqueryMobile-mini/jquery.min.js"></script>
// <link href="JSLoader?EDITOR=no&FileName=jquery.mobile-1.4.2.min.css" rel="stylesheet" type="text/css" />

package in.raster.ioviyam2.servlets;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.FileChannel;
import java.nio.channels.WritableByteChannel;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.zip.DeflaterOutputStream;
import java.util.zip.GZIPOutputStream;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author prasath
 */


public class JSLoader extends HttpServlet {

    private static final SimpleDateFormat httpDateFormat = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss z", Locale.US);

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    public synchronized static String getHttpDate(Date date) {
        return httpDateFormat.format(date);
    }

    public synchronized static Date getDateFromHttpDate(String date) throws ParseException {
        return httpDateFormat.parse(date);
    }
    boolean isgzip = false;
    InputStream resultInStream = null;
    OutputStream resultOutStream = null;
    HttpURLConnection conn = null;
//    String FileName, editer;
    boolean isJSFile = false;

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, ParseException, FileNotFoundException, InterruptedException {
        try {
            String FileName = (String) request.getParameter("FileName");
            String editer = (String) request.getParameter("EDITOR");

            if (FileName.contains(".js")) {
                editer = "yes";
            } else if (FileName.contains(".css")) {
                editer = "no";
            }

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

            if (request.getDateHeader("If-Modified-Since") == -1) {
                sendFile(response, request, FileName, editer);
            } else {
                String requestIfModifiedSince = request.getHeader("If-Modified-Since");
                Date date1 = getDateFromHttpDate(requestIfModifiedSince);
                Date date2 = getFileModifiedDate(FileName, editer);
                if (date1.compareTo(date2) == 0) {
                    response.setStatus(response.SC_NOT_MODIFIED);
                } else {
                    sendFile(response, request, FileName, editer);
                }
            }
        } finally {
//            resultOutStream.close();
        }
    }

    public Date getFileModifiedDate(String filename, String editor) throws ParseException {
        File path = new File(JSLoader.class.getProtectionDomain().getCodeSource().getLocation().getPath());
        String patha = getServletContext().getRealPath("/js/");
        String pathacss = getServletContext().getRealPath("/css/");
        String sourceval = null;
        if (editor.equalsIgnoreCase("yes")) {

            String stringPath = "";
            if (filename.contains("/")) {
                String[] files = filename.split("/");
                for (int i = 0; i < (files.length - 1); i++) {
                    stringPath += files[i] + File.separator;

                }
                stringPath += files[(files.length - 1)];
            } else {
                stringPath = filename;
            }
            sourceval = patha + File.separator + stringPath;
        } else {
            String stringPath = "";
            if (filename.contains("/")) {
                String[] files = filename.split("/");
                for (int i = 0; i < (files.length - 1); i++) {
                    stringPath += files[i] + File.separator;
                }
                stringPath += files[(files.length - 1)];
            } else {
                stringPath = filename;
            }
            sourceval = pathacss + File.separator + stringPath;
        }

        File file = new File(sourceval);
        SimpleDateFormat sdf = new SimpleDateFormat("E,dd MMM yyyy hh:mm:ss");
        String lastMODDate = sdf.format(file.lastModified());
        return sdf.parse(lastMODDate);

    }

    public void sendFile(HttpServletResponse response, HttpServletRequest request, String filename, String editor) throws ParseException, FileNotFoundException, IOException, InterruptedException {

        File path = new File(JSLoader.class.getProtectionDomain().getCodeSource().getLocation().getPath());
        String patha = getServletContext().getRealPath("/js/");
        String pathacss = getServletContext().getRealPath("/css/");

        String sourceval = null;
        if ("yes".equals(editor)) {
            String stringPath = "";
            if (filename.contains("/")) {
                String[] files = filename.split("/");
                for (int i = 0; i < (files.length - 1); i++) {
                    stringPath += files[i] + File.separator;
                }
                stringPath += files[(files.length - 1)];
            } else {
                stringPath = filename;
            }

            isJSFile = true;
            sourceval = patha + File.separator + stringPath;
        } else {
            String stringPath = "";
            if (filename.contains("/")) {
                String[] files = filename.split("/");
                for (int i = 0; i < (files.length - 1); i++) {
                    stringPath += files[i] + File.separator;
                }
                stringPath += files[(files.length - 1)];
            } else {
                stringPath = filename;
            }
            sourceval = pathacss + File.separator + stringPath;
            isJSFile = false;
        }

        File file = new File(sourceval);
        SimpleDateFormat sdf = new SimpleDateFormat("E,dd MMM yyyy hh:mm:ss");
        String lastMODDate = sdf.format(file.lastModified());
        Date now = sdf.parse(lastMODDate);
//                System.out.println("_________________________" + lastMODDate);
        int timeExpire = 2 * 60 * 60 * 24;
//              response.setHeader("Content-type","application/x-javascript");
        response.setHeader("Cache-Control", "max-age=" + timeExpire + ", must-revalidate"); // HTTP 1.1.
        response.setHeader("Pragma", "public"); // HTTP 1.0.
        response.setHeader("Last-modified", getHttpDate(now));
        response.setDateHeader("Expires", new Date().getTime() + timeExpire);

        FileInputStream fIn = new FileInputStream(new File(sourceval));
//        System.out.println("######################################################" + sourceval);
        writeFileChannels(fIn, resultOutStream, response);
    }

    String readFile(String fileName) throws IOException {
        BufferedReader br = new BufferedReader(new FileReader(fileName));
        try {
            StringBuilder sb = new StringBuilder();
            String line = br.readLine();

            while (line != null) {
                sb.append(line);
                sb.append("\n");
                line = br.readLine();
            }
            return sb.toString();
        } finally {
            br.close();
        }
    }

    public File fileWriter(String contents, File tmpFile) {
        FileWriter fileWriter = null;
        try {
            fileWriter = new FileWriter(tmpFile);
            fileWriter.write(contents);
            fileWriter.close();
        } catch (IOException ex) {
        } finally {
            try {
                fileWriter.close();
            } catch (IOException ex) {
            }
        }

        return tmpFile;
    }

    public static String getDateFromMiliSeconds(long mili) {
        SimpleDateFormat df = new SimpleDateFormat("MM/dd/yyyy  HH:mm:SS");
        df.setTimeZone(TimeZone.getTimeZone("GMT"));
        String result = df.format(mili);
        return result;
    }

    public void writeFileChannels(FileInputStream fIn, OutputStream out, HttpServletResponse responce) throws IOException {
//        long time = System.currentTimeMillis();
        if (isgzip) {
            out = new GZIPOutputStream(responce.getOutputStream());
        } else {
            out = responce.getOutputStream();
        }
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
        // deleteFiles(tmpFile);
//        System.out.println("##############@@@@@@@@@@@@@@@########################################");

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
            System.err.println("Temp file2 scheduled for deletion.");
        }

    }

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
            throws ServletException, IOException, FileNotFoundException {
        try {
            processRequest(request, response);
        } catch (ParseException ex) {
            Logger.getLogger(JSLoader.class.getName()).log(Level.SEVERE, null, ex);
        } catch (InterruptedException ex) {
            Logger.getLogger(JSLoader.class.getName()).log(Level.SEVERE, null, ex);
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
            throws ServletException, IOException, FileNotFoundException {
        try {
            processRequest(request, response);
        } catch (ParseException ex) {
            Logger.getLogger(JSLoader.class.getName()).log(Level.SEVERE, null, ex);
        } catch (InterruptedException ex) {
            Logger.getLogger(JSLoader.class.getName()).log(Level.SEVERE, null, ex);
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
