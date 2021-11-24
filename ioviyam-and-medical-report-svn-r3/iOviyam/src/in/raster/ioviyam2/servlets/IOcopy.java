/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package in.raster.ioviyam2.servlets;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.nio.channels.WritableByteChannel;
/**
 *
 * @author prasath
 */
public class IOcopy {
    
    public static void fastCopy(final InputStream src, final OutputStream dest) throws IOException {
        final ReadableByteChannel inputChannel = Channels.newChannel(src);
        final WritableByteChannel outputChannel = Channels.newChannel(dest);
        fastCopy(inputChannel, outputChannel);
    }
    
    public static void fastCopy(final ReadableByteChannel src, final WritableByteChannel dest) throws IOException {
        final ByteBuffer buffer = ByteBuffer.allocateDirect(16 * 1024);
        
        while(src.read(buffer) != -1) {
            buffer.flip();
            dest.write(buffer);
            buffer.compact();
        }
        
        buffer.flip();
        
        while(buffer.hasRemaining()) {
            dest.write(buffer);
        }
    }
}
