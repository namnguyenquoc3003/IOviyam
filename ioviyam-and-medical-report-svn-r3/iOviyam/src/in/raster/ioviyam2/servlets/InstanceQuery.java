package in.raster.ioviyam2.servlets;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.dcm4che2.data.DicomElement;
import org.dcm4che2.data.DicomObject;
import org.dcm4che2.data.Tag;
import org.dcm4che2.io.DicomInputStream;
import org.json.JSONArray;
import org.json.JSONObject;

import in.raster.ioviyam2.model.QueryModel;
import in.raster.ioviyam2.services.DcmQR;

/**
 *
 * @author prasath
 */
//@WebServlet(name = "InstanceQueryServlet", urlPatterns = {"/InstanceQueryServlet"})
public class InstanceQuery extends HttpServlet {

    ArrayList<DicomObject> lists;
    //String ae, host, port;
    QueryModel param;
    String ae, host, port, wado, tyx = "X", listner;

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    Properties prop;
    

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        HttpSession session = request.getSession(true);
        ae = (String) session.getAttribute("ae");
        host = (String) session.getAttribute("host");
        port = (String) session.getAttribute("port");
        wado = (String) session.getAttribute("wado");
        listner = (String) session.getAttribute("listener");
        String patID = request.getParameter("patientId");
        String studyUID = request.getParameter("studyUID");
        String seriesUID = request.getParameter("seriesUID");
        prop = Config.getProb();
        out.print(getDataInstance(patID, studyUID, seriesUID));
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

    ArrayList<String> argumentConstDeepIsntance(String sid, String seid, String objid) {
        ArrayList<String> armnts = new ArrayList<String>();
        armnts.add(ae + "@" + host + ":" + port);
        armnts.add("-I");
        armnts.add("-q00080018=" + objid);
        armnts.add("-q0020000D=" + sid);
        armnts.add("-q0020000E=" + seid);
        return armnts;
    }

    String getDicomTx(String sid, String seid, String objid) throws IOException {
        ArrayList<DicomObject> lists = new ArrayList<DicomObject>();
        Object[] TEST = (Object[]) argumentConstDeepIsntance(sid, seid, objid).toArray();
        String[] argss = Arrays.copyOf(TEST, TEST.length, String[].class);
        DcmQR query = new DcmQR(listner);
        lists = (ArrayList<DicomObject>) query.QueryDcm(argss, listner);
        DicomObject dimobject = lists.get(0);
//        System.out.println("_________________________$@@@@@@@@@@@@@@@@@@@________________________" + dimobject.getString(Tag.TransferSyntaxUID));
        return null;
    }

    JSONArray getDataInstance(String patId, String studyId, String seriesID) {
        JSONArray list = new JSONArray();
        try {
            lists = new ArrayList<DicomObject>();
            Object[] TEST = (Object[]) argumentConstInstance(patId, studyId, seriesID).toArray();
            String[] argss = Arrays.copyOf(TEST, TEST.length, String[].class);
            //  String ags[] = {"PRASATHDCM@192.168.1.187:11112", "-r", "PatientID", "-r", "PatientName", "-r", "PatientSex", "-r", "PatientBirthDate", "-r", "ModalitiesInStudy", "-r", "StudyDescription"};
            DcmQR query = new DcmQR(listner);
            lists = (ArrayList<DicomObject>) query.QueryDcm(argss, listner);
            for (int i = 0; i < lists.size(); i++) {
                JSONObject jobject = new JSONObject();
                DicomObject dimobject = lists.get(i);
                String objid = dimobject.getString(Tag.SOPInstanceUID);
                String dx = dimobject.getString(Tag.TransferSyntaxUID);
                String tranfersyx = "1.2.840.10008.1.2.1";
                String UrlTmp = "";
                if (!tyx.equalsIgnoreCase("X")) {
                    tranfersyx = tyx;
                    UrlTmp = "http://" + host + ":" + wado + "/wado?requestType=WADO&contentType=application/dicom&studyUID=" + studyId + "&seriesUID=" + seriesID + "&objectUID=" + objid + "&transferSyntax=" + tranfersyx;
                } else {
                    UrlTmp = "http://" + host + ":" + wado + "/wado?requestType=WADO&contentType=application/dicom&studyUID=" + studyId + "&seriesUID=" + seriesID + "&objectUID=" + objid;
//                    System.out.println(dx + "_____x_________" + tyx + "________" + tranfersyx + "________________________******___________________________________" + UrlTmp);
                }

                // list.put("http://"+ host + ":" + wado+"/wado?requestType=WADO&studyUID=" + studyId + "&seriesUID=" + seriesID + "&objectUID=" + objid);
                //list.put("imagestream.do?studyUID=" + studyId + "&seriesUID=" + seriesID + "&objectUID=" + objid);
                
                list.put(getImageInfo(UrlTmp, jobject));
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return list;
    }

    JSONObject getImageInfo(String UrlTmp, JSONObject jobject) {
        try {

            InputStream is = null;
            DicomInputStream dis = null;
            URL url = new URL(UrlTmp);
            is = url.openStream();
            dis = new DicomInputStream(is);
            DicomObject dcmObj = dis.readDicomObject();
            DicomElement wcDcmElement = dcmObj.get(Tag.WindowCenter);
            DicomElement wwDcmElement = dcmObj.get(Tag.WindowWidth);
            DicomElement rowDcmElement = dcmObj.get(Tag.Rows);
            DicomElement colDcmElement = dcmObj.get(Tag.Columns);
            DicomElement imgOrientation = dcmObj.get(Tag.ImageOrientationPatient);
            DicomElement imgPosition = dcmObj.get(Tag.ImagePositionPatient);
            DicomElement sliceThick = dcmObj.get(Tag.SliceThickness);
            DicomElement frameOfRefUID = dcmObj.get(Tag.FrameOfReferenceUID);
            DicomElement pixelSpacingEle = dcmObj.get(Tag.PixelSpacing);
            DicomElement framedata = dcmObj.get(Tag.NumberOfFrames);
            DicomElement tx = dcmObj.get(Tag.TransferSyntaxUID);

            DicomElement sopclass = dcmObj.get(Tag.SOPClassUID);
            //To get the Image Type (LOCALIZER / AXIAL / OTHER)
            DicomElement imageType = dcmObj.get(Tag.ImageType);
            String image_type = "";
            if (imageType != null) {
                image_type = new String(imageType.getBytes());
                String[] imageTypes = image_type.split("\\\\");
                if (imageTypes.length >= 3) {
                    image_type = imageTypes[2];
                }
            }
            //To get the Referenced SOP Instance UID
            DicomElement refImageSeq = dcmObj.get(Tag.ReferencedImageSequence);
            DicomElement refSOPInsUID = null;
            String referSopInsUid = "";
            if (refImageSeq != null) {
                if (refImageSeq.hasItems()) {
                    DicomObject dcmObj1 = refImageSeq.getDicomObject();
                    refSOPInsUID = dcmObj1.get(Tag.ReferencedSOPInstanceUID);
                    referSopInsUid = refSOPInsUID != null ? new String(refSOPInsUID.getBytes()) : "";
                }
            }
            String windowCenter = wcDcmElement != null ? new String(wcDcmElement.getBytes()) : "";
            String windowWidth = wwDcmElement != null ? new String(wwDcmElement.getBytes()) : "";
            int nativeRows = rowDcmElement != null ? rowDcmElement.getInt(false) : 512;
            int nativeColumns = colDcmElement != null ? colDcmElement.getInt(false) :512;
            String imgOrient = imgOrientation != null ? new String(imgOrientation.getBytes()) : "";
            String sliceThickness = sliceThick != null ? new String(sliceThick.getBytes()) : "";
            String forUID = frameOfRefUID != null ? new String(frameOfRefUID.getBytes()) : "";
            String txsyx = tx != null ? new String(tx.getBytes()) : "";
            tyx = txsyx;
            String numberofframe = framedata != null ? new String(framedata.getBytes()) : "Empty";
            String sliceLoc = "";
            String imagePosition = "";
            if (imgPosition != null) {
                imagePosition = new String(imgPosition.getBytes());
                sliceLoc = imagePosition.substring(imagePosition.lastIndexOf("\\") + 1);
            }
            String sopclassUID = sopclass != null ? new String(sopclass.getBytes()) : "";

            String pixelSpacing = pixelSpacingEle != null ? new String(pixelSpacingEle.getBytes()) : "";
            jobject.put("windowCenter", windowCenter.replaceAll("\\\\", "|"));
            jobject.put("windowWidth", windowWidth.replaceAll("\\\\", "|"));

            int megaPixels = (nativeRows * nativeColumns) / (1024 * 1024);
            if (prop.getProperty("scaledown").equalsIgnoreCase("OFF") || (megaPixels < 2)) {
                jobject.put("nativeRows", nativeRows);
                jobject.put("nativeColumns", nativeColumns);
                jobject.put("pixelSpacing", pixelSpacing);
                System.out.println(pixelSpacing);

            } else {
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
                jobject.put("pixelSpacing", pxlvalue);
                jobject.put("nativeRows", Math.round(nativeRows / 3.8));
                jobject.put("nativeColumns", Math.round(nativeColumns / 3.8));
            }
            jobject.put("numberofframes", numberofframe);
            jobject.put("trxsyx", txsyx);

            DicomElement cframedelay = dcmObj.get(Tag.FrameIncrementPointer);
            DicomElement framedelayvec = dcmObj.get(Tag.FrameTimeVector);
            DicomElement frametime = dcmObj.get(Tag.FrameTime);
            DicomElement RecommendedDisplayFrameRate = dcmObj.get(Tag.RecommendedDisplayFrameRate);
            //  Array f=(framedelayvec.getBytes()));
            if (frametime != null) {
                //  System.out.println("~~~~~~~~~~~~~~~~~~~~Fraaem time~~~~~~~~~~~~~~~~~~~~"+new String(frametime.getBytes()));
                jobject.put("frametime", new String(frametime.getBytes()));
            }
            if (cframedelay != null) {
                //System.out.println("~~~~~~~~~~~~~~~~~~~~ frame increment pointer~~~~~~~~~~~~~~~~~~~~"+cframedelay.getBytes());
            }
            if (framedelayvec != null) {
                byte[] arry = framedelayvec.getBytes();
                // System.out.println("~~~~~~~~~~~~~~~~~~~~vector00000~~~~~~~~~~~~~~~~~~~~"+arry.length);
                jobject.put("frametimevector", arry);
//                  for (int i = 0; i < arry.length; i++) {
//                   // System.out.println("~~~~~~~~~~~~~~~~~~~~vector00000~~~~~~~~~~~~~~~~~~~~"+arry[i]);
//                     
//                 }

            }
            if (RecommendedDisplayFrameRate != null) {
                // System.out.println("~~~~~~~~~~~~~~~~~~~~RecommendedDisplayFrameRate~~~~~~~~~~~~~~~~~~~~"+new String(RecommendedDisplayFrameRate.getBytes()));
            }

            jobject.put("sliceLocation", sliceLoc);
            jobject.put("sliceThickness", sliceThickness);
            jobject.put("frameOfReferenceUID", forUID.replaceAll("\u0000", ""));
            jobject.put("imagePositionPatient", imagePosition);
            jobject.put("imageOrientPatient", imgOrient);
            jobject.put("sopclassUID", sopclassUID);

            jobject.put("refSOPInsUID", referSopInsUid.replaceAll("\u0000", ""));
            jobject.put("imageType", image_type);
            dis.close();
            is.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return jobject;
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
