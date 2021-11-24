package in.raster.ioviyam2.model;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author prasath
 *
 *
 */
public class QueryModel {

    private String patientId = "";
    private String patientName = "";
    private String birthDate = "";
    private String searchDate = "";
    private String modality = "";
    private String from = "";
    private String to = "";
    private String searchDays = "";
    private String accessionNo = "";
    private String seriesId = "", studyId = "", fromdate = "", todate = "";
    Date date = new Date();
    DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    DateFormat brthdateformat = new SimpleDateFormat("dd/MM/yyyy");
    String s = dateFormat.format(date);
    String pdate = null;
    String fromtime = "", totime = "", fromq, toq;

    public QueryModel() {
        
    }

    /**
     * Setter for property patientId.
     *
     * @param patientId The String object registers the patientId.
     */
    public void setPatientId(String patientId) {
        if (patientId.equals("null") || patientId == null) {
            this.patientId = "";
        } else {
            this.patientId = patientId;
        }
    }
    public void getprada(String dates) {
        this.pdate = dates;
    }
    /**
     * Setter for property patientName.
     *
     * @param patientName The String object registers the patientName.
     */
    public void setPatientName(String patientName) {
        if (patientName.equals("null") || patientName == null) {
            this.patientName = "";
        } else {
            this.patientName = patientName;
        }
    }
    public void setTimefrom(String fromtime) {
        if ( fromtime == null) {
            this.fromtime = "";
        } else {
            this.fromtime = fromtime.replace(":", "");
        }
    }

    public void setTimeto(String totime) {
        if (totime == null) {
            this.totime = "";
        } else {
            this.totime = totime.replace(":", "");
        }
    }

    public void setBirth(String birthDate) {
            if (birthDate.equals("null")||birthDate==null) {
                this.birthDate ="";
            } else {
                this.birthDate = birthDate.replace("/", "");
            }
        
    }

    public void setAccno(String Accno) {
        if (Accno.equals("null")||Accno==null) {
            this.accessionNo = "";
        } else {
            this.accessionNo = Accno;
        }
    }

    public void setModality(String modality) {
        if (modality.equals("null")||modality==null) {
            this.modality = "";
        } else {
            this.modality = modality;
        }
    }

    public void setFromdate(String date) {
        if (date.equals("null")||date==null) {
            this.fromdate = "";
        } else {
            this.fromdate = date.replace("/", "");
        }
    }

    public void setTodate(String to) {
       if (to.equals("null")||to==null) {
            this.todate = "";
        } else {
            this.todate = to.replace("/", "");
        }
    }

    /**
     * Setter for property birthDate.
     *
     * @param birthDate The String object registers the birthDate.
     */
    public void setBirthDate(String birthDate) {
        if (birthDate == null) {
            this.birthDate = "";
        } else {
            try {
                SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
                SimpleDateFormat sformate = new SimpleDateFormat("yyyyMMdd");
                Date datee = formatter.parse(birthDate);
                birthDate = sformate.format(datee);
                this.birthDate = birthDate;
            } catch (ParseException ex) {
                ex.printStackTrace();
                Logger.getLogger(QueryModel.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    /**
     * Setter for property searchDate.
     *
     * @param searchDate The String object registers the searchDate.
     */
    public void setSearchDate(String searchDate) {
        if (searchDate == null) {
            this.searchDate = "";
        } else {
            this.searchDate = searchDate;
        }
    }

    /**
     * Setter for property modality.
     *
     * @param modality The String object registers the modality.
     */
//    public void setModality(String modality1) {
//        String mod = modality1;
//        if (mod.equalsIgnoreCase("All Modality")) {
//            this.modality = "";
//        } else {
//            this.modality = modality1;
//        }
//    }
    /**
     * Setter for property to.
     *
     * @param to The String object registers the to.
     */
    public void setTo(String to) {
        if (to == null || to.equalsIgnoreCase("")) {
            this.to = "";
        } else {
            try {
                SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
                SimpleDateFormat sformate = new SimpleDateFormat("yyyyMMdd");

                Date datee = formatter.parse(to);
                to = sformate.format(datee);
                this.to = to;
            } catch (ParseException ex) {
                ex.printStackTrace();
                Logger.getLogger(QueryModel.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    /**
     * Setter for property from
     *
     * @param from The String object registers the from.
     */
    public void setFrom(String from) {
        if (from == null || from.equalsIgnoreCase("")) {
            this.from = "";
        } else {
            try {
                SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
                SimpleDateFormat sformate = new SimpleDateFormat("yyyyMMdd");

                Date datee = formatter.parse(from);
                from = sformate.format(datee);
                this.from = from;
            } catch (ParseException ex) {
                ex.printStackTrace();
                Logger.getLogger(QueryModel.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    public void setFromQ(String from) {
        if (from == null) {
            this.fromq = "";
        } else {
            this.fromq = from;
        }
    }

    public void setToQ(String to) {
        if (to == null) {
            this.toq = "";
        } else {
            this.toq = to;
        }




    }

    public String getfromQ() {
        return fromq;
    }

    public String gettoQ() {
        return toq;
    }

    public String getSearchDaysQ() {
        String date = "";
        if (!fromq.equals("") && !toq.equals("")) {
            date = fromq + "-" + toq;
        }
        return date;
    }

    /**
     * Setter for property searchDays.
     *
     * @param searchDays The String object registers the searchDays.
     */
    public void setSearchDays(String searchDays) {
        if (searchDays == null) {
            this.searchDays = "";
        } else {
            this.searchDays = searchDays;
        }
    }

    public void setSearchDays(String searchDays, String from, String to) {
        if (searchDays == null && from == null && to == null) {
            this.searchDays = "";
        } else {
            try {
                this.searchDays = searchDays;
                SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
                SimpleDateFormat sformate = new SimpleDateFormat("yyyyMMdd");

                Date datee = formatter.parse(from);
                Date todate = formatter.parse(to);
                from = sformate.format(datee);
                to = sformate.format(todate);
                this.from = from;
                this.to = to;
            } catch (ParseException ex) {
                Logger.getLogger(QueryModel.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }

    public String getSearchDays() {
        return searchDays;
    }

    public String getSearchTime() {
        String time = "";
        if (!fromtime.equals("") && !totime.equals("")) {
            time = fromtime + "-" + totime;
        } else if (!fromtime.equals("")) {
            time = fromtime;
        } else if (!totime.equals("")) {
            time = totime;
        }
        return time;
    }

    /**
     * It calculates and returns the lastweek's date(7 days ago from current
     * date).
     *
     * @return String value of lastweek's date.
     */
    public String getLastWeek() {
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Calendar currDate = Calendar.getInstance();
        currDate.add(Calendar.DATE, -7); //go back 7 days
        currDate.getTime();
        return dateFormat.format(currDate.getTime());
    }

    /**
     * It calculates and returns the lastmonth's date(31 days ago from current
     * date).
     *
     * @return String value of lastmonth's date.
     */
    public String getLastMonth() {
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Calendar currDate = Calendar.getInstance();
        currDate.add(Calendar.DATE, -31); //go back 31 days
        currDate.getTime();
        return dateFormat.format(currDate.getTime());
    }

    /**
     * Calculates and returns the string format of yesterday Date.
     *
     * @return String value of yesterday.
     */
    public String getYesterday() {
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Calendar currDate = Calendar.getInstance();
        currDate.add(Calendar.DATE, -1); //go back 1 days
        currDate.getTime();
        return dateFormat.format(currDate.getTime());
    }

    /**
     * Calculates and returns the date based on the searchDays value.
     *
     * @return String value of searchDate.
     */
    public String getSearchDate() {
        if (searchDays.equalsIgnoreCase("Last week")) {
            String lastWeek = getLastWeek();
            lastWeek = lastWeek.replace("-", "");
            s = s.replace("-", "");
            searchDate = lastWeek + "-" + s;
        } else if (searchDays.equalsIgnoreCase("Today")) {
            s = s.replace("-", "");
            searchDate = s + "-" + s;
        } else if (searchDays.equalsIgnoreCase("Last Month")) {
            String lastMonth = getLastMonth();
            lastMonth = lastMonth.replace("-", "");
            s = s.replace("-", "");
            searchDate = lastMonth + "-" + s;
        } else if (searchDays.equalsIgnoreCase("Yesterday")) {
            String yesterDay = getYesterday();
            yesterDay = yesterDay.replace("-", "");
            searchDate = yesterDay + "-" + yesterDay;
        } else if (searchDays.equalsIgnoreCase("Between")) {
            from = from.replace("/", "");
            to = to.replace("/", "");
            from = from.replace("-", "");
            to = to.replace("-", "");
            if (from.equals(" ")) {
                from = " ";
            }
            if (to.equals(" ")) {
                to = "";
            }

            searchDate = from + "-" + to;
        } else if (searchDays.equalsIgnoreCase("quick")) {
            searchDate = fromq + "-" + toq;
        } else {
            searchDate = "";
        }
        // System.out.println("##########################33date formate"+searchDate);
        return this.searchDate;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public String getFrom() {
        return from;
    }

    public String getFromTime() {
        return fromtime;
    }

    public String getToTime() {
        return totime;
    }

    public String getModality() {
        return modality;
    }

    public String getPatientId() {
        return patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public String getTo() {
        return to;
    }

    public String getAccessionNo() {
        return accessionNo;
    }

    public void setAccessionNo(String accessionNo) {
        this.accessionNo = accessionNo;
    }

    public void setSeriesId(String seriesId) {
        if (seriesId == null) {
            this.seriesId = "";
        } else {
            this.seriesId = seriesId;
        }
    }

    public void setStudyId(String studyId) {
        if (studyId == null) {
            this.studyId = "";
        } else {
            this.studyId = studyId;
        }
    }

    public String getstudyId() {
        return studyId;
    }

    public String getFromDate() {
        return fromdate;
    }

    public String getToDate() {
        return todate;
    }

    public String getBirthdate() {
        return birthDate;
    }
}
