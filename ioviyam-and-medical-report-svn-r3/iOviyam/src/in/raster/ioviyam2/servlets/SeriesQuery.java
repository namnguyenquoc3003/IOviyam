/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package in.raster.ioviyam2.servlets;

import java.io.File;
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
import org.json.JSONException;
import org.json.JSONObject;

import in.raster.ioviyam2.dao.GenericDAO;
import in.raster.ioviyam2.model.QueryModel;
import in.raster.ioviyam2.model.Serie;
import in.raster.ioviyam2.services.DcmQR;

/**
 *
 * @author prasath
 */
//@WebServlet(name = "SeriesQueryServlet", urlPatterns = {"/SeriesQueryServlet"})
public class SeriesQuery extends HttpServlet {

    
    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    ArrayList<DicomObject> lists;
    //String ae, host, port;
    QueryModel param;
    String ae, host, port, wado, serverName, accNo, listner;
    boolean isDirectUrl = false;
    GenericDAO dao = new GenericDAO();
    

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        HttpSession session = request.getSession(true);
        
        Config.filelocationTMP = (File) getServletContext().getAttribute("javax.servlet.context.tempdir");
        Config.setSessionDirect(request);
        ae = (String) session.getAttribute("ae");
        host = (String) session.getAttribute("host");
        port = (String) session.getAttribute("port");
        wado = (String) session.getAttribute("wado");
        listner = (String) session.getAttribute("listener");

        serverName = request.getParameter("ServerName");
        accNo = request.getParameter("AccessionNo");

        if (ae == null && host == null & port == null) {
            Config.setSessionDirect(request);
            isDirectUrl = true;
        }

        try {
            param = new QueryModel();

            param.setPatientId(request.getParameter("PatientID"));
            if (request.getParameter("StudyID") != null && request.getParameter("StudyID").length() > 0) {
            param.setStudyId(request.getParameter("StudyID"));
            }
            if (request.getParameter("Modality") != null && request.getParameter("Modality").length() > 0) {
                param.setModality(request.getParameter("Modality"));
            }

            if (accNo != null && accNo.length() > 0) {
                param.setAccessionNo(accNo);
            }
            out.print(getDataSeries(param));
            out.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    ArrayList<String> argumentConstSeries(QueryModel param) {
        ArrayList<String> armnts = new ArrayList<String>();
        armnts.add(ae + "@" + host + ":" + port);
        armnts.add("-S");
        armnts.add("-q0020000D=" + param.getstudyId());
//       
        armnts.add("-q00080060=" + param.getModality());

        armnts.add("-r");
        armnts.add("0008103E");

        //check whether direct URL launch
        if (isDirectUrl) {
            if (param.getAccessionNo() != null) {
                armnts.add("-q00080050=" + param.getAccessionNo());
                armnts.add("-r");
                armnts.add("0020000D"); //for studyUID
            }
            armnts.add("-r");
            armnts.add("00100020");     // for Patient ID
            armnts.add("-r");
            armnts.add("00100010");     //for Patient Name
            armnts.add("-r");
            armnts.add("00100040");     //for Patient Gender
            armnts.add("-r");
            armnts.add("00080020");     //for Study Date
            armnts.add("-r");
            armnts.add("00081030");
        }

        return armnts;
    }

    ArrayList<String> argumentConstInstance(String patId, String studyId, String seriesID) {
        ArrayList<String> armnts = new ArrayList<String>();
        armnts.add(ae + "@" + host + ":" + port);
        armnts.add("-I");
        armnts.add("-q00100020=" + patId);
        armnts.add("-q0020000D=" + studyId);
        armnts.add("-q0020000E=" + seriesID);
        return armnts;
    }
    String objid;

    JSONArray getDataInstance(String patId, String studyId, String seriesID) {

//        System.out.println(patId + "*******************************-------" + studyId + "--------------*" + seriesID);
        JSONArray list = new JSONArray();
        try {

            lists = new ArrayList<DicomObject>();
            Object[] TEST = (Object[]) argumentConstInstance(patId, studyId, seriesID).toArray();
            String[] argss = Arrays.copyOf(TEST, TEST.length, String[].class);
            //  String ags[] = {"PRASATHDCM@192.168.1.187:11112", "-r", "PatientID", "-r", "PatientName", "-r", "PatientSex", "-r", "PatientBirthDate", "-r", "ModalitiesInStudy", "-r", "StudyDescription"};
            DcmQR query = new DcmQR(listner);
            lists = (ArrayList<DicomObject>) query.QueryDcm(argss, listner);

//            System.out.println("*******************************---------------------*"+lists.size());
            for (int i = 0; i < lists.size(); i++) {
                DicomObject dimobject = lists.get(i);

//                if (dimobject.getString(Tag.Modality).equalsIgnoreCase("PR")) {
//
//                } else {
                objid = dimobject.getString(Tag.SOPInstanceUID);
                String sopinstancuid = dimobject.getString(Tag.SOPClassUID);
                // System.out.println("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~" + i+".....Instance number"+dimobject.getString(Tag.InstanceNumber));
                // list.put(i, i);
                int index = 0;
                String indexnum = dimobject.getString(Tag.InstanceNumber);
                String numberframe = dimobject.getString(Tag.FrameDelay);
//                System.out.println("frame numbers <<<<<<<<//////////////" + numberframe);
                // if(numberframe==null){//
                if (indexnum == null) {
                    list.put("imagestream.doImage?studyUID=" + studyId + "&seriesUID=" + seriesID + "&objectUID=" + objid + "&sopClassUID=" + sopinstancuid);
                } else {
                    index = Integer.parseInt(dimobject.getString(Tag.InstanceNumber));
                    //System.out.println("!!!!!!!!!!!!!!!!!************"+index);
                    // list.put("http://"+ host + ":" + wado+"/wado?requestType=WADO&studyUID=" + studyId + "&seriesUID=" + seriesID + "&objectUID=" + objid);
                    list.put(index, "imagestream.doImage?studyUID=" + studyId + "&seriesUID=" + seriesID + "&objectUID=" + objid + "&sopClassUID=" + sopinstancuid);
                }
//                }
                //  }
            }
            // System.out.println("************.."+);
            for (int i = 0; i < list.length(); i++) {
                if (list.get(i).equals(null)) {
                    list.remove(i);
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return list;
    }

    JSONArray getDataSeries(QueryModel param) {
        JSONArray list = new JSONArray();
        try {
            lists = new ArrayList<DicomObject>();
            Object[] TEST = (Object[]) argumentConstSeries(param).toArray();
            String[] argss = Arrays.copyOf(TEST, TEST.length, String[].class);
//            for (int i = 0; i < argss.length; i++) {
//            }
            DcmQR query = new DcmQR(listner);
            lists = (ArrayList<DicomObject>) query.QueryDcm(argss, listner);
            //  System.out.println(" ----------- DicomObject : " + lists.size());
            for (DicomObject dimobject : lists) {

                if (dimobject.getString(Tag.Modality).equalsIgnoreCase("PR")) {

                } else {

                    JSONObject Objectjson = new JSONObject();
                    // DicomObject dimobject = lists.get(i);
                    String seriesUID = dimobject.getString(Tag.SeriesInstanceUID);
                    // System.out.println(" -----------------SeriesIUID : " + seriesUID);
                    String seriesNumber = dimobject.getString(Tag.SeriesNumber);
                    String modality = dimobject.getString(Tag.Modality);
//                String[] Modality = dimobject.getStrings(Tag.ModalitiesInStudy);
                    String bodypart = dimobject.getString(Tag.BodyPartExamined);
                    String totalInstance = dimobject.getString(Tag.NumberOfSeriesRelatedInstances);
                    String seriesDesc = dimobject.getString(Tag.SeriesDescription);

//                System.out.println("###########################################study uid..." + dimobject.getString(Tag.StudyInstanceUID));
                    Objectjson.put("seriesUID", seriesUID);
                    Objectjson.put("seriesNumber", seriesNumber);
                    Objectjson.put("modality", modality);
                    Objectjson.put("seriesDesc", seriesDesc);
                    Objectjson.put("bodyPart", bodypart);
                    Objectjson.put("totalInstances", totalInstance);
                    Objectjson.put("patientId", param.getPatientId());
                    Objectjson.put("studyUID", param.getstudyId());
                    
                    if (param.getstudyId() != null && param.getstudyId().length() > 0) {
                        Objectjson.put("url", getDataInstance(param.getPatientId(), param.getstudyId(), seriesUID));
                    } else {
                        Objectjson.put("url", getDataInstance(param.getPatientId(), dimobject.getString(Tag.StudyInstanceUID), seriesUID));
                    }

                    if (isDirectUrl) {
                        String patName = dimobject.getString(Tag.PatientName);
                        String patId = dimobject.getString(Tag.PatientID);
                        String patGen = dimobject.getString(Tag.PatientSex);
                        String studyDate = dimobject.getString(Tag.StudyDate);
                        String studyDesc = dimobject.getString(Tag.StudyDescription);

                        Objectjson.put("patientName", patName);
                        Objectjson.put("patientId", patId);
                        Objectjson.put("patientGender", patGen);

                        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
                        SimpleDateFormat sformate = new SimpleDateFormat("dd-MMM-yyyy");
                        try {
                            if (studyDate != null) {
                                Date dt = formatter.parse(studyDate);
                                studyDate = sformate.format(dt);
                            }
                        } catch (ParseException e) {
                            studyDate = studyDate;
                        }
                        Objectjson.put("studyDate", studyDate);
                        Objectjson.put("studyDesc", studyDesc);
                    }

                    list.put(Objectjson);
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        //System.out.println(" ----------- json : " + list.length());
        return list;
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
