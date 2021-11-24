/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package in.raster.ioviyam2.servlets;

import in.raster.ioviyam2.services.DcmEcho;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author prasath
 */
//@WebServlet(name = "EchoService", urlPatterns = {"/EchoService"})
public class EchoService extends HttpServlet {

    String ae, host, port, listner;

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
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        try {
//            ae = request.getParameter("ae");
//            host = request.getParameter("host");
//            port = request.getParameter("port");
//            wado = request.getParameter("wadoport");
            HttpSession session = request.getSession(true);
            ae = (String) session.getAttribute("ae");
            host = (String) session.getAttribute("host");
            port = (String) session.getAttribute("port");
            listner = (String) session.getAttribute("listener");
            out.print(getDataInstance(ae, host, port));
        } finally {
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
        DcmEcho echo = new DcmEcho(listner);
        sucess = echo.echoStatus(argss);
        return sucess;
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
}
