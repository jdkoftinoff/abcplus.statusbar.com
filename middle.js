/*
  AVB Bandwidth Calculator, Version 2014-05-23

  Copyright (c) 2014, J.D. Koftinoff Software, Ltd. <jeffk@jdkoftinoff.com>
  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

   3. Neither the name of J.D. Koftinoff Software, Ltd. nor the names of its
      contributors may be used to endorse or promote products derived from
      this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
  LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
  SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
  INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
  CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
  POSSIBILITY OF SUCH DAMAGE.
*/

function getLinkBandwidth() {
    return Number(document.getElementById("input_network_speed_in_bps").value);
}

function getAvbAllowance() {
    return 75;
}

function recalculate() {
    var totalChannels = 0;
    var totalBw = 0;
    var totalStreams = 0;
    const elements = document.querySelectorAll("div.inputs div input");
    elements.forEach((element) => {
        const format = element.getAttribute("data-format");
        const sampleRate = element.getAttribute("data-sr");
        const channelCount = Number(element.getAttribute("data-channels"));
        const streamCount = Number(element.value);
        const inputs = {
            "network_speed_in_bps": getLinkBandwidth(),
            "avb_bw": getAvbAllowance(),
            "stream_format": format,
            "sample_rate": sampleRate,
            "bits_per_sample": 24,
            "channel_count": channelCount,
            "async": 0,
            "aes_siv": 0
        }
        if (streamCount > 0) {
            console.log(format, sampleRate, channelCount, streamCount);
            const result = calculate_avb(inputs);
            console.log(result.total_bw_used_in_bps);
            totalChannels = (streamCount * channelCount) + totalChannels;
            totalBw += streamCount * result.nominal_bw_per_stream_in_bps;
            console.log(result);
            totalStreams = totalStreams + 1;
        }
    })
    document.getElementById("totalChannels").value = String(totalChannels);
    console.log(getLinkBandwidth());
    console.log(totalBw);
    const avbBwPercent = (totalBw / getLinkBandwidth()) * 100;
    document.getElementById("bwUsage").value = avbBwPercent.toFixed(2) + "%";
    document.getElementById("totalStreams").value = totalStreams;
}
