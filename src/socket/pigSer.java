package org.example.service;

import java.io.*;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class pigSer {
    //定义相关的参数,端口,存储Socket连接的集合,ServerSocket对象
    //以及线程池
    private static final int PORT = 12345;
    private List<Socket> mList = new ArrayList<Socket>();
    private ServerSocket server = null;
    private ExecutorService myExecutorService = null;

    public static void main(String[] args){
        new pigSer();
    }

    public pigSer(){
        try{
            server = new ServerSocket(PORT);
            InetAddress address = InetAddress.getLocalHost();
            String ip = address.getHostAddress();

            //创建线程池
            myExecutorService = Executors.newCachedThreadPool();
            System.out.println("服务端运行中。。。"+ip);
            Socket client = null;

            while(true){
                client = server.accept();
                mList.add(client);
                myExecutorService.execute(new Service(client));
            }
        }catch(IOException e){
            e.printStackTrace();
            System.out.println(e);
        }

    }


    class Service implements Runnable
    {
        private Socket socket;
        private BufferedReader in = null;
        private String msg ="";

        public Service(Socket socket){
            this.socket = socket;
            try{

                in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                msg = "用户" + this.socket.getInetAddress()+"~加入了聊天室" + "当前在线人数 "+mList.size();

                this.sendmsg();

            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        @Override
        public void run(){
            try{
                while(true){

                    msg = in.readLine();
                    if (msg == null) {
                        break;
                    }
                        if(msg.equals("bye"))
                        {
                            System.out.println("~~~~~~~~~");
                            mList.remove(socket);
                            in.close();
                            msg = "用户"+socket.getInetAddress()
                                    +"退出："+"当前人数："+mList.size();
                            socket.close();
                            this.sendmsg();
                            break;
                        }else{
                            msg=socket.getInetAddress()+"说:"+msg;
                            this.sendmsg();
                        }
                }
            }catch (IOException e)
            {
                System.err.println("客户端异常断开连接: " + e.getMessage());
            }finally {
                // 【关键修复 3】把清理逻辑放在 finally 块中！
                // 无论是因为 msg==null、异常，还是收到 bye，都会执行这里
                mList.remove(socket);

                try {
                    if (in != null) in.close();
                    if (socket != null) socket.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                System.out.println("当前剩余在线人数：" + mList.size());
            }
        }

        public void sendmsg(){
            System.out.println(msg);
            int num = mList.size();
            for(int index = 0 ;index<num;index++)
            {
                Socket mSocket=mList.get(index);
                PrintWriter pout = null;
                try{
                    pout = new PrintWriter(new BufferedWriter(new OutputStreamWriter(mSocket.getOutputStream(),"UTF-8")),true);
                }catch (IOException e){
                    throw new RuntimeException(e);
                }
            }
        }

    }
}
