/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package in.raster.ioviyam2.servlets;

import in.raster.ioviyam2.core.DcmRcv;
import in.raster.ioviyam2.core.MoveScu;

/**
 *
 * @author prasath
 */
public class Recevier {

    private DcmRcv dcmrcv = null;

    public Recevier(String listener, int listner_port, String destination) {
        
//        System.out.println("__XXX_______"+listener+"___"+listner_port+"___"+destination);
        
        dcmrcv = new DcmRcv();
        dcmrcv.setAEtitle(listener);
        dcmrcv.setHostname("0.0.0.0");
        dcmrcv.setPort(listner_port);
        //dcmrcv.setDestination(ServerConfigLocator.locate().getServerHomeDir() + File.separator + "data");
//        String dest = "/home/prasath";
        dcmrcv.setDestination(destination);
        dcmrcv.setTransferSyntax(new String[]{"1.2.840.10008.1.2","1.2.840.10008.1.2.1"});
        dcmrcv.setPackPDV(false);
        dcmrcv.setTcpNoDelay(false);
        dcmrcv.initTransferCapability();
        dcmrcv.setTlsNeedClientAuth(false);
        MoveScu.maskNull(listener);
    }

    public void start() throws Exception {
        if (dcmrcv != null) {
//            System.out.println("___________XXXXX_____Stoppinggggg");
            dcmrcv.stop();
        }
        dcmrcv.start();
        System.out.println("Server listening................");
    }

    public void stop() {
        if (dcmrcv != null) {
            dcmrcv.stop();
            System.out.println("Server stop listening................");
            dcmrcv = null;
        }
    }
}
