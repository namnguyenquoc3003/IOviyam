/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package in.raster.ioviyam2.servlets;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import in.raster.ioviyam2.dao.GenericDAO;
import in.raster.ioviyam2.model.Serie;

/**
 *
 * @author prasath
 */
public class SeriesReport extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	
	GenericDAO dao = new GenericDAO();
    

	/**
	 * Processes requests for HTTP <code>POST</code> method.
	 * @param request			servlet request
	 * @param response			servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException      if an I/O error occurs
	 */
	protected void processRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/html;charset=UTF-8");

		String seriesid = request.getParameter("seriesid");
		String numeOrde = request.getParameter("numeOrde");
		String diagMedi = request.getParameter("diagMedi");
		String obse = request.getParameter("obse");
		
		Serie serie = new Serie();
		serie.setSeriesIuid(seriesid);
		serie.setReportOrderNumb(numeOrde);
		serie.setReportMedicDiag(diagMedi);
		serie.setReportObs(obse);
		dao.update(serie);
	}

	/**
	 * Processes requests for HTTP <code>GET</code> method.
	 * @param request			servlet request
	 * @param response			servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException      if an I/O error occurs
	 */
	protected void processResponse(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
        
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        JSONArray list = new JSONArray();
        JSONObject Objectjson = new JSONObject();
        String seriesid = request.getParameter("seriesid");
        try {
        	Serie serie = dao.findByPK(seriesid);
        	Objectjson.put("seriesid", serie.getSeriesIuid());
        	Objectjson.put("reportOrderNumb", serie.getReportOrderNumb());
        	Objectjson.put("reportMedicDiag", serie.getReportMedicDiag());
        	Objectjson.put("reportObs", serie.getReportObs());
            list.put(Objectjson);
            out.print(list);
        } catch (Exception e) {
            e.printStackTrace();
        }
	}
	
	/**
	 * Handles the HTTP <code>GET</code> method.
	 * @param request servlet request
	 * @param response servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException if an I/O error occurs
	 */
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		processResponse(request, response);
	}

	/**
	 * Handles the HTTP <code>POST</code> method.
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
	 * @return a String containing servlet description
	 */
	@Override
	public String getServletInfo() {
		return "Short description";
	}
	
}
