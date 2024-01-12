import category from "../public/data/category.json"

export const getCategory = (lang) => {
    return category?.map(category => {
        return {
            label: lang === "en" ? category.category : category.category_ina,
            query: category.category,
            value: category.categoryId
        }
    })
}

export const timeout = (ms) => {
    console.log(ms);
    return new Promise((resolve) => setTimeout(resolve, ms));
};
export const checkOverflow = (element) => {
    if (!element) return false;
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
};
export const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            console.log(reader.result);
            resolve(reader.result?.split("base64,")?.[1]);
        };
        reader.onerror = (error) => reject(error);
    });
};
export const uploadFile = (maxSize = 1000000) => {
    return new Promise((resolve) => {
        let input = document.createElement("input");
        input.type = "file";
        input.accept = "image/png,image/jpg,image/jpeg";

        input.onchange = async (e) => {
            let file = e.target.files[0];

            if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
                resolve({ error: "Only support JPEG and PNG only." });
            }
            if (file.size > maxSize) {
                resolve({ error: `Maximum size is ${maxSize / 1000}kb.` });
            }

            const base64 = await toBase64(file);
            resolve({ data: base64, metadata: file });
        };

        input.click();
    });
};
export const convertRupiah = (number, option = {}) => {
    const { separator = ",", initial = "Rp. " } = option

    const reverse = number?.toString().split("").reverse().join("");
    let ribuan = reverse?.match(/\d{1,3}/g);
    ribuan = ribuan?.join(separator).split("").reverse().join("") || 0;
    return initial + ribuan;
};
export const getLocalIp = () => { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    return new Promise(function (resolve, reject) {
        // NOTE: window.RTCPeerConnection is "not a constructor" in FF22/23
        let RTCPeerConnection = /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

        if (!RTCPeerConnection) {
            reject('Your browser does not support this API');
        }

        let rtc = new RTCPeerConnection({ iceServers: [] });

        function grepSDP(sdp) {
            let finalIP = '';
            let parts = ""
            sdp.split('\r\n').forEach(function (line) { // c.f. http://tools.ietf.org/html/rfc4566#page-39
                if (~line.indexOf("a=candidate")) {     // http://tools.ietf.org/html/rfc4566#section-5.13
                    parts = line.split(' ')        // http://tools.ietf.org/html/rfc5245#section-15.1
                    const addr = parts[4]
                    const type = parts[7];
                    if (type === 'host') {
                        finalIP = addr;
                    }
                } else if (~line.indexOf("c=")) {       // http://tools.ietf.org/html/rfc4566#section-5.7
                    parts = line.split(' ')
                    const addr = parts[2];
                    finalIP = addr;
                }
            });
            return finalIP;
        }

        if (window.mozRTCPeerConnection) {      // FF [and now Chrome!] needs a channel/stream to proceed
            rtc.createDataChannel('', { reliable: false });
        }

        rtc.onicecandidate = function (evt) {
            // convert the candidate to SDP so we can run it through our general parser
            // see https://twitter.com/lancestout/status/525796175425720320 for details
            if (evt.candidate) {
                let addr = grepSDP("a=" + evt.candidate.candidate);
                resolve(addr);
            }
        };
        rtc.createOffer(function (offerDesc) {
            rtc.setLocalDescription(offerDesc);
        }, function (e) { console.warn("offer failed", e); });
    });
}
