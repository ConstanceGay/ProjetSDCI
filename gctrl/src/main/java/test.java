import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class test {

    public static void main(String[] args) {
        try {
            Process process = Runtime.getRuntime().exec("curl -X PUT http://127.0.0.1:5001/restapi/compute/dc1/GI2 -H 'Content-Type: application/json' -d '{\"image\":\"constancegay/projet_sdci:gatewayD\", \"network\":\"(id=GI2-eth0,ip=10.0.0.216/24)\"}'");
            //build response into a string
            String output = "";
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            BufferedReader stdError = new BufferedReader(new InputStreamReader(process.getErrorStream()));

            String line = null;
            System.out.println("<ERROR>");
            while ( (line = reader.readLine()) != null)
                System.out.println(line);
            System.out.println("</ERROR>");
            int exitVal = 0;
            try {
                exitVal = process.waitFor();

                System.out.println("Process exitValue: " + exitVal);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


}
