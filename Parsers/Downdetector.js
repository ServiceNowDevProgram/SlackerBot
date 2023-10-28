/*
activation_example:!downdetector service-name
regex:!downdetector
flags:gmi
*/
var service = current.text.replace(/!downdetector/gmi, "").trim().toLowerCase();
var mapped_services = {
  "aws": {
    "link": "https://downdetector.com/status/aws-amazon-web-services/"
  },
  "doordash": {
    "link": "https://downdetector.com/status/doordash/"
  },
  "spectrum": {
    "link": "https://downdetector.com/status/spectrum/"
  },
  "diablo": {
    "link": "https://downdetector.com/status/diablo/"
  },
  "servicenow": {
    "link": "https://downdetector.com/status/service-now/"
  },
  "youtube": {
    "link": "https://downdetector.com/status/youtube/"
  },
  "at&t": {
    "link": "https://downdetector.com/status/att/"
  },
  "verizon": {
    "link": "https://downdetector.com/status/verizon/"
  },
  "tmobile": {
    "link": "https://downdetector.com/status/t-mobile/"
  },
  "gcp": {
    "link": "https://downdetector.com/status/google-cloud/"
  },
  "google": {
    "link": "https://downdetector.com/status/google/"
  },
  "googledrive": {
    "link": "https://downdetector.com/status/google-drive/"
  },
  "waze": {
    "link": "https://downdetector.com/status/waze/"
  },
  "x": {
    "link": "https://downdetector.com/status/twitter/"
  },
  "gmail": {
    "link": "https://downdetector.com/status/gmail/"
  },
  "office365": {
    "link": "https://downdetector.com/status/microsoft-365/"
  },
  "azure": {
    "link": "https://downdetector.com/status/windows-azure/"
  },
  "teams": {
    "link": "https://downdetector.com/status/teams/"
  },
  "reddit": {
    "link": "https://downdetector.com/status/reddit/"
  },
  "discord": {
    "link": "https://downdetector.com/status/discord/"
  },
  "downdetector": {
    "link": "https://downdetector.com/status/downdetector/"
  }
}

if (service == '') {
	var send_confusion = new x_snc_slackerbot.Slacker().send_chat(current.channel, ':upside_down_face: No service name given! Try with services like "google", "aws", etc.', false, '', current.thread_ts);
} else if(mapped_services[service] != undefined){
	new x_snc_slackerbot.Slacker().send_chat(current, ">> Check status for the service here: "+ mapped_services[service].link.toString(), current.thread_ts);
} else {
	new x_snc_slackerbot.Slacker().send_chat(current, "https://downdetector.com/search/?q="+ service.toString(), current.thread_ts);
}
