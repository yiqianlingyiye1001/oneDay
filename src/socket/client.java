package org.example;


import com.sun.xml.internal.ws.policy.privateutil.PolicyUtils;
import jdk.nashorn.internal.runtime.regexp.joni.ScanEnvironment;

import java.io.*;
import java.net.Socket;
import java.util.Scanner;

public class client {

    private static final String HOST = "192.168.215.1";
    private static final int PORT = 12345;
    private Socket socket = null;
    private BufferedReader in = null;
    private PrintWriter out = null;
    private String content = "";
    private StringBuilder sb = null;

    public static void main(String[] args) {

        client myClient = new client();
        myClient.connect();

        // 稍作休眠，让 connect 里的子线程把 Socket 和流初始化完毕
        try { Thread.sleep(1000); } catch (InterruptedException e) {}

        // 启动两个独立的线程
        myClient.startReceiveThread(); // 负责接收服务端消息
        myClient.startSendThread();    // 负责读取键盘输入并发给服务端

    }
    public void connect(){
        new Thread(){
            public void run(){
                try{
                    socket = new Socket(HOST,PORT);
                    in = new BufferedReader(new InputStreamReader(socket.getInputStream(),"UTF-8"));
                    out = new PrintWriter(new BufferedWriter(new OutputStreamWriter(socket.getOutputStream())),true);
                    System.out.println("连接成功！");
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        }.start();
    }

    private void startReceiveThread() {
        new Thread(){
            public void run(){
                try{
                    String content;
                    while((content = in.readLine())!=null){
                        System.out.println("服务端-"+content);
                    }
                    System.out.println("服务端已断开连接");
                }catch (IOException e)
                {
                    e.printStackTrace();
                }
            }
        }.start();
    }

    private void startSendThread() {
        new Thread() {
            public void run() {
                Scanner scanner = new Scanner(System.in);
                try{
                    while(true){
                        String input = scanner.nextLine();
                        if(out!=null){
                            out.println(input);
                        }
                    }
                } catch ( Exception e) {
                    throw new RuntimeException(e);
                }
            }
        }.start();
    }
}
