import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Random;

/**
 * @author couedrao on 27/11/2019.
 * @project gctrl
 */
class MANOAPI {

    String deploy_gw(Map<String, String> vnfinfos) {
        //String ip = "192.168.0." + (new Random().nextInt(253) + 1);
        String ip = "10.0.0.216";
        Main.logger(this.getClass().getSimpleName(), "Deploying VNF ...");

        //printing
        for (Entry<String, String> e : vnfinfos.entrySet()) {
            Main.logger(this.getClass().getSimpleName(), "\t" + e.getKey() + " : " + e.getValue());
        }
        //TODO

        return ip;
    }

    List<String> deploy_multi_gws_and_lb(List<Map<String, String>> vnfsinfos) {
        List<String> ips = new ArrayList<>();
        ips.add("10.0.0.217");
        ips.add("10.0.0.216");

        try {
            Process process = Runtime.getRuntime().exec("curl -X PUT " +
                    "http://localhost:5001/restapi/compute/dc1/"+ vnfsinfos.get(0).get("name")+" -H 'Content-Type: " +
                    "application/json' -d '{\"image\":\""+ vnfsinfos.get(0).get("image")+"\", \"network\":\"" +
                    "(id=GI2-eth0,ip="+ ips.get(1) + "/24)\"}'");

            //build response into a string
            StringBuilder output = new StringBuilder();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line + "\n");
            }
            System.out.println(output.toString());

        } catch (IOException e){
            Main.logger(this.getClass().getSimpleName(), "gateway couldn't be launched");
        }



        try {
            Process process2 = Runtime.getRuntime().exec("curl -X PUT " +
                    "http://127.0.0.1:5001/restapi/compute/dc1/lb -H 'Content-Type: application/json' -d " +
                    "'{\"image\":\"constancegay/projet_sdci:lb\", \"network\":\"(id=lb-eth0,ip="
                    + ips.get(0)+"/24)\"}'");
        } catch (IOException e){
            Main.logger(this.getClass().getSimpleName(), "server couldn't be launched");
        }

        for (Map<String, String> vnfsinfo : vnfsinfos) {
            ips.add(deploy_gw(vnfsinfo));
        }

        return ips;
    }
}
