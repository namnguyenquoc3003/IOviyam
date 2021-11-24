package in.raster.ioviyam2.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import in.raster.ioviyam2.model.Serie;

public class GenericDAO {

	Connection db = null;
	Statement st = null;
	
	
	public void connect(){
        try {
        	Class.forName("org.postgresql.Driver");
			db = DriverManager.getConnection("jdbc:postgresql://localhost/pacsdb", "postgres", "");
			st = db.createStatement();
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
	}
	
	public void disconnect(){
		try {
			db.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public Serie findByPK(String id) {
		connect();
		Serie s = new Serie();
		try {
			ResultSet rs = st.executeQuery("select * from series where series_iuid = '" + id +"'");
			while(rs.next()){
				s.setPk(rs.getLong("pk"));
				s.setReportOrderNumb(rs.getString("report_order_numb"));
				s.setReportMedicDiag(rs.getString("report_medic_diag"));
				s.setReportObs(rs.getString("report_obs"));
			}
			disconnect();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return s;
	}

	public void update(Serie serie) {
		connect();
		StringBuilder s = new StringBuilder();
		s.append(" update series ");
		s.append(" set report_order_numb = '" + serie.getReportOrderNumb() + "' ");
		s.append(" , report_medic_diag = '" + serie.getReportMedicDiag() + "' ");
		s.append(" , report_obs = '" + serie.getReportObs() + "' ");
		s.append(" where series_iuid = '" + serie.getSeriesIuid() + "'");
		try {
			int b = st.executeUpdate(s.toString());
			disconnect();
			System.out.println(s.toString()+" Estado: "+b);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
}
