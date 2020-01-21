import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

/**
 * @author couedrao on 27/11/2019.
 * @project gctrl
 */
class SDNCtrlAPI {

    String redirect_traffic(String olddestip, String newdestip) {
        String status = "OK";
        Main.logger(this.getClass().getSimpleName(), "olddestip = " + olddestip + "; newdestip = " + newdestip);
        //TODO

        return status;
    }
    
    public static void POSTRequest(String POST_PARAMS) throws IOException {
        System.out.println(POST_PARAMS);
        URL obj = new URL("http://localhost:8080/stats/flowentry/add");
        HttpURLConnection postConnection = (HttpURLConnection) obj.openConnection();
        postConnection.setRequestMethod("POST");
        //postConnection.setDoOutput(true);
        OutputStream os = postConnection.getOutputStream();
        os.write(POST_PARAMS.getBytes());
        os.flush();
        os.close();
        int responseCode = postConnection.getResponseCode();
        System.out.println("POST Response Code :  " + responseCode);
        System.out.println("POST Response Message : " + postConnection.getResponseMessage());
        if (responseCode == HttpURLConnection.HTTP_CREATED) { //success
            BufferedReader in = new BufferedReader(new InputStreamReader(
                postConnection.getInputStream()));
            String inputLine;
            StringBuffer response = new StringBuffer();
            while ((inputLine = in .readLine()) != null) {
                response.append(inputLine);
            } in .close();
            // print result
            System.out.println(response.toString());
        } else {
            System.out.println("POST NOT WORKED");
        }
    }

    String insert_a_loadbalancer(String oldgwip, String lbip, List<String> newgwsip) {
        String status = "OK";
        Main.logger(this.getClass().getSimpleName(), "oldgwip = " + oldgwip + "; lbip = " + lbip + "; newgwsip = " + newgwsip);

        //reroute requests going to GI to load_balancer
        try {
        	//String req1 = "curl -X POST -d '{\"dpid\": 2,\"cookie\": 0,\"table_id\": 0,\"priority\": 1111,\"flags\": 1,\"match\":{\"nw_dst\":\""+oldgwip+"\",\"dl_type\": 2048},\"actions\":[{\"type\": \"SET_FIELD\",\"field\": \"ipv4_dst\",\"value\":\""+lbip+"\"},{\"type\":\"OUTPUT\",\"port\":\"NORMAL\"}]}' http://localhost:8080/stats/flowentry/add";
        	String req1 = "{\"dpid\": 2,\"cookie\": 0,\"table_id\": 0,\"priority\": 1111,\"flags\": 1,\"match\":{\"nw_dst\":\""+oldgwip+"\",\"dl_type\": 2048},\"actions\":[{\"type\": \"SET_FIELD\",\"field\": \"ipv4_dst\",\"value\":\""+lbip+"\"},{\"type\":\"OUTPUT\",\"port\":\"NORMAL\"}]}";
        	POSTRequest(req1);
        	System.out.println(req1);
            //Process process = Runtime.getRuntime().exec(req1);
        } catch (IOException e) {
            Main.logger(this.getClass().getSimpleName(), "Couldn't reroute traffic 1");
        }

        // make frames coming from load_balancer look like they're from GI
        // so the ACK/SYN-ACK/ACK part of tcp works with the GFi
        try {
        	String req2 = "curl -X POST -d '{\"dpid\": 2,\"cookie\": 0,\"table_id\": 0,\"priority\": 1111,\"flags\": 1,\"match\":{\"nw_src\": \""+lbip+"\",\"dl_type\": 2048},\"actions\":[{\"type\": \"SET_FIELD\",\"field\": \"ipv4_src\",\"value\": \""+oldgwip+"\"},{\"type\":\"OUTPUT\",\"port\":\"NORMAL\"}]}' http://localhost:8080/stats/flowentry/add";
            System.out.println(req2);
        	Process process2 = Runtime.getRuntime().exec(req2);
        } catch (IOException e) {
            Main.logger(this.getClass().getSimpleName(), "Couldn't reroute traffic 2");
        }

        try {
        	String req3 = "curl -X POST -d '{\"dpid\": 2,\"cookie\": 0,\"table_id\": 0,\"priority\": 2000,\"flags\": 1,\"match\":{\"nw_src\": \""+lbip+"\",\"nw_dst\": \""+oldgwip+"\",\"dl_type\": 2048},\"actions\":[{\"type\":\"OUTPUT\",\"port\":\"NORMAL\"}]}' http://localhost:8080/stats/flowentry/add";
        	System.out.println(req3);
            Process process2 = Runtime.getRuntime().exec(req3);
            
        } catch (IOException e) {
            Main.logger(this.getClass().getSimpleName(), "Couldn't reroute traffic 3");
        }

        return status;
    }

    String remove_less_important_traffic(String importantsrcip) {
        String status = "OK";
        //Main.logger(this.getClass().getSimpleName(), "importantsrcip = " + importantsrcip);
        //TODO

        return status;
    }


}
