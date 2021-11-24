/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package in.raster.ioviyam2.servlets;

import in.raster.ioviyam2.services.DcmQR;
import in.raster.ioviyam2.model.QueryModel;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.dcm4che2.data.DicomObject;
import org.dcm4che2.data.Tag;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author prasath
 */
//@WebServlet(name = "QueryServlet", urlPatterns = {"/QueryServlet"})
public class StudyQuery extends HttpServlet {

    JSONObject sample;
    ArrayList<DicomObject> lists;
    String ae, host, port, wado, listner;
    QueryModel param;
    HttpSession session;

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

        HttpSession session = request.getSession(true);
        listner = (String) session.getAttribute("listener");
        ae = (String) session.getAttribute("ae");
        host = (String) session.getAttribute("host");
        port = (String) session.getAttribute("port");
        String patientid, patientname, modality, accno, birth;
        String studydate;
        String patienttext;
        String from;
        String to;
        String fromqDate;
        String toqDate;
        String fromtime;
        String totime, timedetails, birthdate;
        session = request.getSession(true);
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        try {
            patientid = request.getParameter("patientID");
            patientname = request.getParameter("patientName");
            modality = request.getParameter("Modality");
            accno = request.getParameter("Acc-no");
            birth = request.getParameter("Birthdate");
            fromqDate = request.getParameter("From");
            toqDate = request.getParameter("To");
            fromtime = request.getParameter("tfrom");
            totime = request.getParameter("tto");
            //birthdate = request.getParameter("Birthdate");
//            ae = request.getParameter("ae");
//            host = request.getParameter("host");
//            port = request.getParameter("port");
//            wado = request.getParameter("wadoport");
//            session.setAttribute("Ae", ae);
//            session.setAttribute("host", host);
//            session.setAttribute("port", port);
//            session.setAttribute("wadoport", wado);
            param = new QueryModel();
             System.out.println("!!!!!!!!!!!!333333333333333333333333333333!!!!!..."+fromqDate+"...."+toqDate);
            param.setModality(modality);
            param.setPatientId(patientid);
            param.setPatientName(patientname);
            param.setFromdate(fromqDate);
            param.setTodate(toqDate);
            param.setTimefrom(fromtime);
            param.setTimeto(totime);
            param.setAccno(accno);
            param.setBirth(birth);
            out.print(getData(param));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    JSONArray getData(QueryModel param) {
        JSONArray list = new JSONArray();
        try {
            lists = new ArrayList<DicomObject>();
            String[] modlityList = param.getModality().split(",");

            for (int i = 0; i < modlityList.length; i++) {
                String modality = modlityList[i];
                param.setModality(modality);
                Object[] TEST = (Object[]) argumentConst(param).toArray();
                String[] argss = Arrays.copyOf(TEST, TEST.length, String[].class);
                //  String ags[] = {"PRASATHDCM@192.168.1.187:11112", "-r", "PatientID", "-r", "PatientName", "-r", "PatientSex", "-r", "PatientBirthDate", "-r", "ModalitiesInStudy", "-r", "StudyDescription"};
                DcmQR query = null;
                query = new DcmQR(listner);
                lists = (ArrayList<DicomObject>) query.QueryDcm(argss, listner);
                for (DicomObject dimobject : lists) {
                    JSONObject Objectjson = new JSONObject();
                    // DicomObject dimobject = lists.get(i);
                    String PatientName = dimobject.getString(Tag.PatientName);
                    String PatientBirthDate = dimobject.getString(Tag.PatientBirthDate);
                    String PatientSex = dimobject.getString(Tag.PatientSex);
                    String[] Modality = dimobject.getStrings(Tag.ModalitiesInStudy);
                    String id = dimobject.getString(Tag.PatientID);
                    String seriesnumber = dimobject.getString(Tag.NumberOfStudyRelatedSeries);
                    String studydsp = dimobject.getString(Tag.StudyDescription);
                    String studydate = dimobject.getString(Tag.StudyDate);
                    SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
                    SimpleDateFormat sformate = new SimpleDateFormat("dd-MMM-yyyy");
                    try {
                        if (studydate != null) {
                            Date datee = formatter.parse(studydate);
                            studydate = sformate.format(datee);
                        }
                    } catch (ParseException e) {
                        studydate = studydate;
                    }
                    String instance = dimobject.getString(Tag.NumberOfStudyRelatedInstances);
                    String accno = dimobject.getString(Tag.AccessionNumber);
                    String studyid = dimobject.getString(Tag.StudyInstanceUID);
                    String studydesc = dimobject.getString(Tag.StudyDescription);
                    String sex = dimobject.getString(Tag.PatientSex);
                    String thickness = dimobject.getString(Tag.SliceThickness);
                    Objectjson.put("PatientName", PatientName);
                    Objectjson.put("PatientId", id);
                    Objectjson.put("DateOfBirth", PatientBirthDate);
                    Objectjson.put("AcessionNo", accno);
                    Objectjson.put("StudyDate", studydate);
                    Objectjson.put("Modality", Modality);
                    Objectjson.put("NumberOfImages", instance);
                    Objectjson.put("studyid", studyid);
                    Objectjson.put("seriesno", seriesnumber);
                    Objectjson.put("studydesc", studydesc);
                    Objectjson.put("sex", sex);
                    Objectjson.put("thickness", thickness);

                    // System.out.println("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$------"+i);
                    list.put(Objectjson);
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return list;
    }

    ArrayList<String> argumentConst(QueryModel param) {
//        System.out.println("___________3_____________" + ae);
        ArrayList<String> armnts = new ArrayList<String>();
//        System.out.println("___________4_____________" + ae);

        armnts.add(ae + "@" + host + ":" + port);
        armnts.add("-r");
        armnts.add("PatientID");
        armnts.add("-r");
        armnts.add("PatientName");
        armnts.add("-r");
        armnts.add("PatientSex");
        armnts.add("-r");
        armnts.add("PatientBirthDate");
        armnts.add("-r");
        armnts.add("ModalitiesInStudy");
        armnts.add("-r");
        armnts.add("StudyDescription");
//        armnts.add("-r");
//        armnts.add("StudyDescription");
        if (!(param.getPatientId().equalsIgnoreCase("") || param.getPatientId() == null)) {
//            armnts.add("-qPatientID=" + param.getPatientId());
            // System.out.println("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"+param.getPatientId()+".."+param.getPatientName()+"..."+param.getFromDate());
        }
        if (!(param.getPatientName().equalsIgnoreCase("") || param.getPatientName() == null)) {
            armnts.add("-qPatientName=" + param.getPatientName());

        }
        if (!(param.getAccessionNo().equalsIgnoreCase("") || param.getAccessionNo() == null)) {
            armnts.add("-qAccessionNumber=" + param.getAccessionNo());
        }
        if (!(param.getBirthDate().equalsIgnoreCase("") || param.getBirthDate() == null)) {
            armnts.add("-qPatientBirthDate=" + param.getBirthDate());
        }
        if (!(param.getModality().equalsIgnoreCase("")) && !param.getModality().equalsIgnoreCase("All")) {
            armnts.add("-qModalitiesInStudy=" + param.getModality());
        }
        //if (!(param.getSearchDate().equalsIgnoreCase(""))||param) {
        if (param.getFromDate().equals("") && param.getToDate().equals("")) {
        } else {
            armnts.add("-qStudyDate=" + param.getFromDate() + "-" + param.getToDate());
        }
      // }
        // if (!(param.getSearchTime().equalsIgnoreCase(""))) {

        //System.out.println("~~~~~~~~~~~~~~~~~~~~~~~~~~~study time~~~~~~~~~~~~~~~~~~``"+param.getf);
        if (param.getFromTime().equals("") && param.getToTime().equals("")) {
        } else {
            armnts.add("-qStudyTime=" + param.getFromTime() + "-" + param.getToTime());
        }
        // }
        return armnts;
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
