/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package in.raster.ioviyam2.servlets;

import in.raster.ioviyam2.services.DcmEcho;
import java.io.*;
import java.net.BindException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
//import net.sf.json.JSONObject;
import org.json.JSONObject;

/**
 *
 * @author prasath
 */
//@WebServlet(name = "Config", urlPatterns = {"/Config"})
public class Config extends HttpServlet {
  /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    public static File filelocationTMP;
      public static String fileConfigname="iOviyam.properties";
    

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
//        File filelocation = ServerConfigLocator.locate().getServerHomeDir();
        filelocationTMP = (File) getServletContext().getAttribute("javax.servlet.context.tempdir");
        //String location = "/home/prasath/NetBeansProjects/Iviewer5/";
        File fileParent = new File(filelocationTMP.getParent());
        String location = fileParent.getAbsolutePath() + File.separator;
//        System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!" + location);
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        String ae = request.getParameter("ae");
        String hostname = request.getParameter("host");
        String port = request.getParameter("port");
        String wado = request.getParameter("wado");
        String query_type = request.getParameter("query_type");
        String lisner = request.getParameter("listener");
        String lisner_port = request.getParameter("listener_port");
        
//        String fapp = request.getParameter("fapp");
//        String bapp = request.getParameter("bapp");
        
         String fapp ="";
        String bapp = "";

        String compress = request.getParameter("compress");
        String scale = request.getParameter("scale");

        String type = request.getParameter("type");
        Properties prop = new Properties();
        JSONObject Objectjson = new JSONObject();
        File filedata = new File(location + fileConfigname);
        if (!filedata.exists()) {
            copyFileUsingFileStreams();
        }
        try {
            prop.load(new FileInputStream(filedata));
        } catch (FileNotFoundException e) {
            copyFileUsingFileStreams();
        }
        String langDetails = prop.getProperty("lang");

        try {
            if (type.equals("read")) {
                if (filedata.exists()) {
                    prop.load(new FileInputStream(filedata));
                      
                    Objectjson.put("fapp", prop.getProperty("fapp"));
                    Objectjson.put("bapp", prop.getProperty("bapp")); 
                    Objectjson.put("aetitle", prop.getProperty("AETitle"));
                    Objectjson.put("hostname", prop.getProperty("host"));
                    Objectjson.put("port", prop.getProperty("port"));
                    Objectjson.put("query_type", prop.getProperty("query_type"));
                    Objectjson.put("wado", prop.getProperty("wado"));

                    Objectjson.put("compress", prop.getProperty("jpeg2000"));
                    Objectjson.put("scale", prop.getProperty("scaledown"));

//                    Objectjson.put("aetitle", prop.getProperty("AETitle"));
                    Objectjson.put("listener", prop.getProperty("listener"));
                    Objectjson.put("listener_port", prop.getProperty("listener_port"));
//                    Objectjson.put("lang", prop.getProperty("lang"));
                    setSessionAe(request, prop.getProperty("AETitle"), prop.getProperty("host"), prop.getProperty("port"), prop.getProperty("wado"), prop.getProperty("listener"), prop.getProperty("listener_port"), prop.getProperty("query_type"));
                    out.print(Objectjson);
                } else {
                    out.print("false");
                }
            } else if (type.equals("write")) {
                prop.setProperty("AETitle", ae);
                prop.setProperty("host", hostname);
                prop.setProperty("port", port);
                prop.setProperty("wado", wado);
                prop.setProperty("query_type", query_type);

                prop.setProperty("jpeg2000", compress);
                prop.setProperty("scaledown", scale);

//                prop.setProperty("lang", langDetails);
                prop.setProperty("listener", lisner);
                prop.setProperty("listener_port", lisner_port);
                
                prop.setProperty("fapp", "");
                prop.setProperty("bapp", "");
                
                ImageIO.scanForPlugins();

                setSessionAe(request, ae, hostname, port, wado, lisner, lisner_port, query_type);
                prop.store(new FileOutputStream(filedata), null);
                String cstoreDest = filelocationTMP.getAbsolutePath() + File.separator;

                if (!getDataInstance(lisner, "localhost", lisner_port)) {

                    Recevier rcv = new Recevier(lisner, Integer.parseInt(lisner_port), cstoreDest);
                    if (query_type.equalsIgnoreCase("CGET") || query_type.equalsIgnoreCase("CMOVE")) {
                        try {
                            rcv.start();
                            System.out.println("========Started========");
                        } catch (BindException x) {
                            rcv.stop();
                            Thread.sleep(200);
                            rcv = new Recevier(lisner, Integer.parseInt(lisner_port), cstoreDest);
                            System.out.println("========Restarted========");
                            rcv.start();
                        }
                    } else if (wado.equalsIgnoreCase("WADO")) {
                        rcv.stop();
                    }
                }
                out.print("updated");
            }
        } catch (Exception ex) {
            out.print("failed");
            ex.printStackTrace();
            out.close();
        }
    }

    ArrayList<String> argumentConst(String ae, String host, String port) {
        ArrayList<String> armnts = new ArrayList<String>();
        armnts.add(ae + "@" + host + ":" + port);
        return armnts;
    }

    boolean getDataInstance(String ae, String host, String port) throws IOException {
        boolean sucess;
        Object[] TEST = (Object[]) argumentConst(ae, host, port).toArray();
        String[] argss = Arrays.copyOf(TEST, TEST.length, String[].class);
        //  String ags[] = {"PRASATHDCM@192.168.1.187:11112", "-r", "PatientID", "-r", "PatientName", "-r", "PatientSex", "-r", "PatientBirthDate", "-r", "ModalitiesInStudy", "-r", "StudyDescription"};
        DcmEcho echo = new DcmEcho("iOviyam2");
        sucess = echo.echoStatus(argss);
        return sucess;
    }

    public static void setSessionDirect(HttpServletRequest request) {
        File filelocation = new File(filelocationTMP.getParent());
        String location = filelocation.getAbsolutePath() + File.separator;
        File filedata = new File(location +fileConfigname);
        HttpSession session = request.getSession(true);
        if (filedata.exists()) {
            Properties prop = new Properties();
            try {
                prop.load(new FileInputStream(filedata));
            } catch (IOException ex) {
                Logger.getLogger(Config.class.getName()).log(Level.SEVERE, null, ex);
            }
            Config.setSessionAe(request, prop.getProperty("AETitle"), prop.getProperty("host"), prop.getProperty("port"), prop.getProperty("wado"), prop.getProperty("listener"), prop.getProperty("listener_port"), prop.getProperty("query_type"));
//            System.out.println("**********************************************************************" + session.getAttribute("listener"));
        }
    }

    public static Properties getProb() throws IOException {

        File filelocation = new File(filelocationTMP.getParent());
        String location = filelocation.getAbsolutePath() + File.separator;
        Properties prop = new Properties();
        prop.load(new FileInputStream(location + fileConfigname));
        return prop;

    }

    public static File getTmpdirPath() {

        return filelocationTMP;
    }

    public static void setSessionAe(HttpServletRequest request, String ae, String host, String port, String wado, String listener, String lstnport, String quertype) {

        HttpSession session = request.getSession(true);
        session.setAttribute("ae", ae);
        session.setAttribute("host", host);
        session.setAttribute("port", port);
        session.setAttribute("query_type", quertype);
        session.setAttribute("wado", wado);
        session.setAttribute("listener", listener);
        session.setAttribute("listener_port", lstnport);
    }

    private void copyFileUsingFileStreams()
            throws IOException {
        String sourcePath = this.getClass().getClassLoader().getResource("").getPath();
//        File filelocation = ServerConfigLocator.locate().getServerHomeDir();
//        File path = new File(Config.class.getProtectionDomain().getCodeSource().getLocation().getPath());        
        File tempDir = (File) getServletContext().getAttribute("javax.servlet.context.tempdir");
        String location = new File(tempDir.getParent()).getAbsolutePath() + File.separator + fileConfigname;
//        String sourceval = path.getParent() + File.separator + fileConfigname;        
        String sourceval = this.getClass().getResource(File.separator + "conf" + File.separator + fileConfigname).getPath();
        
        InputStream input = null;
        OutputStream output = null;
        try {
            input = new FileInputStream(sourceval);
            output = new FileOutputStream(location);
            byte[] buf = new byte[1024];
            int bytesRead;
            while ((bytesRead = input.read(buf)) > 0) {
                output.write(buf, 0, bytesRead);
            }
        } finally {
            input.close();
            output.close();
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
            throws ServletException, IOException {
        processRequest(request, response);
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
        processRequest(request, response);
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
