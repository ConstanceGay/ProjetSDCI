import java.io.IOException;
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

    String insert_a_loadbalancer(String oldgwip, String lbip, List<String> newgwsip) {
        String status = "OK";
        Main.logger(this.getClass().getSimpleName(), "oldgwip = " + oldgwip + "; lbip = " + lbip + "; newgwsip = " + newgwsip);

        //reroute requests going to GI to load_balancer
        try {
            Process process = Runtime.getRuntime().exec("curl -X POST -d '{\n" +
                    "   \t\"dpid\": 2,\n" +
                    "    \t\"cookie\": 0,\n" +
                    "    \t\"table_id\": 0,\n" +
                    "    \t\"priority\": 1111,\n" +
                    "    \t\"flags\": 1,\n" +
                    "    \t\"match\":{\n" +
                    "\t\t\"nw_dst\": \""+ oldgwip +"\",\n" +
                    "        \t\"dl_type\": 2048\n" +
                    "    \t},\n" +
                    "   \t\"actions\":[{\"type\": \"SET_FIELD\",\n" +
                    "   \t        \"field\": \"ipv4_dst\",\n" +
                    "   \t        \"value\": \""+lbip+"\"},\n" +
                    "\t\t{\"type\":\"OUTPUT\",\n" +
                    "\t\t\"port\":\"NORMAL\"}\n" +
                    "    ]\n" +
                    " }' http://localhost:8080/stats/flowentry/add");
        } catch (IOException e) {
            Main.logger(this.getClass().getSimpleName(), "Couldn't reroute traffic 1");
        }

        // make frames coming from load_balancer look like they're from GI
        // so the ACK/SYN-ACK/ACK part of tcp works with the GFi
        try {
            Process process2 = Runtime.getRuntime().exec("curl -X POST -d '{\n" +
                    "   \t \"dpid\": 2,\n" +
                    "    \t\"cookie\": 0,\n" +
                    "    \t\"table_id\": 0,\n" +
                    "    \t\"priority\": 1111,\n" +
                    "    \t\"flags\": 1,\n" +
                    "    \t\"match\":{\n" +
                    "\t\t\"nw_src\": \""+lbip+"\",\n" +
                    "        \t\"dl_type\": 2048\n" +
                    "    \t},\n" +
                    "   \t\"actions\":[{\"type\": \"SET_FIELD\",\n" +
                    "   \t        \"field\": \"ipv4_src\",\n" +
                    "   \t        \"value\": \""+oldgwip+"\"},\n" +
                    "\t\t{\"type\":\"OUTPUT\",\n" +
                    "\t\t\"port\":\"NORMAL\"}\n" +
                    "    ]\n" +
                    " }' http://localhost:8080/stats/flowentry/add");
        } catch (IOException e) {
            Main.logger(this.getClass().getSimpleName(), "Couldn't reroute traffic 2");
        }

        try {
            Process process2 = Runtime.getRuntime().exec("curl -X POST -d '{\n" +
                    "   \t \"dpid\": 2,\n" +
                    "    \t\"cookie\": 0,\n" +
                    "    \t\"table_id\": 0,\n" +
                    "    \t\"priority\": 2000,\n" +
                    "    \t\"flags\": 1,\n" +
                    "    \t\"match\":{\n" +
                    "\t\t\"nw_src\": \""+lbip+"\",\n" +
                    "\t\t\"nw_dst\": \""+oldgwip+"\",\n" +
                    "        \t\"dl_type\": 2048\n" +
                    "    \t},\n" +
                    "   \t\"actions\":[{\"type\":\"OUTPUT\",\n" +
                    "\t\t\"port\":\"NORMAL\"}\n" +
                    "    ]\n" +
                    " }' http://localhost:8080/stats/flowentry/add");
        } catch (IOException e) {
            Main.logger(this.getClass().getSimpleName(), "Couldn't reroute traffic 3");
        }

        return status;
    }

    String remove_less_important_traffic(String importantsrcip) {
        String status = "OK";
        Main.logger(this.getClass().getSimpleName(), "importantsrcip = " + importantsrcip);
        //TODO

        return status;
    }


}
