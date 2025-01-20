import { Readable } from 'node:stream';

class OneToHundredStream extends Readable {
    index = 1;

    _read() {
        const i = this.index++;
        setTimeout(() => {
            if (i > 5) {
                this.push(null); // Finaliza o stream
            } else {
                const buf = Buffer.from(String(i)); // Converte o número em buffer
                this.push(buf); // Envia o dado para o stream
            }
        }, 1000);
    }
}

// Converte o stream Node.js para um ReadableStream da Web
const nodeStreamToWebReadable = (nodeStream) => {
    return new ReadableStream({
        start(controller) {
            nodeStream.on('data', chunk => {
                controller.enqueue(chunk); // Envia os dados para o ReadableStream
            });

            nodeStream.on('end', () => {
                controller.close(); // Finaliza o ReadableStream
            });

            nodeStream.on('error', err => {
                controller.error(err); // Caso ocorra erro, propaga o erro
            });
        }
    });
};

const webReadableStream = nodeStreamToWebReadable(new OneToHundredStream());

fetch('http://localhost:3334', {
    method: 'POST',
    body: webReadableStream, // Agora estamos enviando um ReadableStream compatível com o fetch
    duplex: 'half' // Especifica a opção duplex
})
.then(response => {
    return response.text()
}).then(data => {
    console.log(data)
})
