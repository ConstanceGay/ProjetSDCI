import com.github.signaflo.math.operations.DoubleFunctions;
import com.github.signaflo.timeseries.TimeSeries;
import com.github.signaflo.timeseries.forecast.Forecast;
import com.github.signaflo.timeseries.model.arima.Arima;
import com.github.signaflo.timeseries.model.arima.ArimaOrder;
import de.vandermeer.asciitable.AsciiTable;
import de.vandermeer.asciitable.CWC_LongestWord;
import de.vandermeer.asciithemes.a7.A7_Grids;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import org.json.JSONObject;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
//

//* @author couedrao on 25/11/2019.

//* @project gctrl

//

//


//* 1)Collects the details from the managed resources e g topology Collects the details from the managed resources e.g.  topology information, metrics (e.g. offered capacity and throughput), configuration property settings and so on.


//* 2)The monitor function aggregates,correlates and filters these details until it determines a symptom that needs to be analyzed.


//*


@SuppressWarnings({"SynchronizeOnNonFinalField"})
class Monitor {
    private static List<String> symptom;
    private static final int period = 2000;
    private static double i = 0;
    public String gw_current_SYMP = "N/A";

    void start() {
        Main.logger(this.getClass().getSimpleName(), "Start monitoring of " + Knowledge.gw);
        symptom = Main.shared_knowledge.get_symptoms();
        Main.shared_knowledge.create_lat_tab();
        data_collector(); //in bg
        symptom_generator();
    }

    //Symptom Generator  (can be modified)
    private void symptom_generator() {
        while (Main.run)
            try {
                Thread.sleep(period * 5);
                ResultSet rs = Main.shared_knowledge.select_from_tab();
                //print_nice_rs(rs);
                double[] prediction = predict_next_lat(rs);
                boolean isOk = true;
                for (int j = 0; j < Knowledge.horizon; j++) {
                    if (prediction[j] > Knowledge.gw_lat_threshold) {
                        Main.logger(this.getClass().getSimpleName(), "Symptom --> To Analyse : " + symptom.get(1));
                        update_symptom(symptom.get(1));
                        isOk = false;
                        break;
                    } else if (prediction[j] < .0) {
                        Main.logger(this.getClass().getSimpleName(), " Symptom --> To Analyse : " + symptom.get(0));
                        update_symptom(symptom.get(0));
                        isOk = false;
                        break;
                    }
                }
                if (isOk) {
                    Main.logger(this.getClass().getSimpleName(), "Symptom --> To Analyse : " + symptom.get(2));
                    update_symptom(symptom.get(2));
                }
            } catch (SQLException | InterruptedException e) {
                e.printStackTrace();
            }
    }

    //Data Collector TODO : modify
    private void data_collector() {
        new Thread(() -> {
            Main.logger(this.getClass().getSimpleName(), "Filling db with latencies");
            while (Main.run)
                try {
                    //TODO: Remove this
                    Thread.sleep(period);
                    Main.shared_knowledge.insert_in_tab(new java.sql.Timestamp(new java.util.Date().getTime()), get_data());
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

        }

        ).start();
    }

    private double get_data() {
        //Call Sensors
        /*TODO*/
        double latence = 0.0;
        try {
            //send request to vnfmonitor
            //Process process = Runtime.getRuntime().exec("sudo docker exec mn.mon curl http://localhost:8383/monitor");
            Process process = Runtime.getRuntime().exec("curl http://10.0.0.204:8383/monitor");

            //build response into a string
            StringBuilder output = new StringBuilder();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line + "\n");
            }

            //extract response for the GI
            //reponse for the server is also avaible at LATSRV
            JSONObject obj = new JSONObject(output.toString());
            latence = obj.getDouble("LATGI");

            Main.logger(this.getClass().getSimpleName(), "Latence du GI  = " + latence);

        } catch (Exception e) {
            e.printStackTrace();
        }

        return latence;
    }

    private double get_fake_data() {
        //return new Random().nextInt();
        return i += 2.5;
    }

    //ARIMA-based Forecasting
    private double[] predict_next_lat(ResultSet rs) throws SQLException {
        rs.first();
        double[] history = new double[Knowledge.moving_wind];
        double[] p = new double[Knowledge.horizon];
        int j = Knowledge.moving_wind - 1;
        while (rs.next()) {
            history[j] = Double.parseDouble(rs.getString("latency"));
            j--;
        }
        TimeSeries timeSeries = TimeSeries.from(DoubleFunctions.arrayFrom(history));
        ArimaOrder modelOrder = ArimaOrder.order(0, 1, 1, 0, 1, 1);
        //ArimaOrder modelOrder = ArimaOrder.order(0, 0, 0, 1, 1, 1);
        Arima model = Arima.model(timeSeries, modelOrder);
        Forecast forecast = model.forecast(Knowledge.moving_wind);
        System.out.print("Point Estimates : ");
        for (int k = 0; k < Knowledge.horizon; k++) {
            p[k] = forecast.pointEstimates().at(k);
            System.out.print(p[k] + "; ");
        }
        System.out.println();
        return p;
    }

    private void print_nice_rs(ResultSet rs) throws SQLException {
        rs.first();
        AsciiTable at = new AsciiTable();
        at.addRule();
        at.addRow("Timestamp", "Latency_in_" + Knowledge.gw);
        at.addRule();
        while (rs.next()) {
            at.addRow(rs.getTimestamp("id").getTime(), rs.getString("latency"));
            at.addRule();
        }
        at.getContext().setGrid(A7_Grids.minusBarPlusEquals());
        at.getRenderer().setCWC(new CWC_LongestWord());
        System.out.println(this.getClass().getSimpleName() + " : ");
        System.out.println(at.render());

    }

    private void update_symptom(String symptom) {

        synchronized (gw_current_SYMP) {
            gw_current_SYMP.notify();
            gw_current_SYMP = symptom;

        }
    }


}