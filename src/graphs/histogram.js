let scaleDraw = {
    rgb: (histogramData, dest, destCtx, options, maxCount) => {
        if (options.fill) {
            destCtx.strokeStyle = "#000"
        } else if (false) {
            //...
        }

        for (var col = 0; col < 3; col++) {

            if (col == 0)
                destCtx.fillStyle = "#f00";
            else if (col == 1)
                destCtx.fillStyle = "#0f0";
            else
                destCtx.fillStyle = "#00f";

            if (options.alias) {
                destCtx.beginPath();
                destCtx.moveTo(0, dest.height);
            }

            //histogramData [r|g|b|a] [0-255]
            for (var x, y, i = 0; i <= 255; i++) {
                var colData = histogramData[col];

                y = Math.round((colData[i] / maxCount) * dest.height);
                x = Math.round((i / 255) * dest.width);

                if (options.alias) {
                    destCtx.lineTo(x, dest.height - y);
                } else if (plotStyle.value === 'discreet') {
                    if (options.fill) {
                        destCtx.fillRect(x, dest.height - y, discreetWidth, y);
                    } else {
                        destCtx.fillRect(x, dest.height - y, discreetWidth, 2);
                    }
                }
            }

            if (options.alias) {
                destCtx.lineTo(x, dest.height);
                if (options.fill) {
                    destCtx.fill();
                }
                destCtx.stroke();
                destCtx.closePath();
            }
        }
    },
    luma: () => {

    },
    HUE: () => {

    },
    HSL: () => {

    }
};

/*
  let histogramData = [];
  histogramData.push(new Array(256).fill(0));
  histogramData.push(new Array(256).fill(0));
  histogramData.push(new Array(256).fill(0));
  histogramData.push(new Array(256).fill(0));
  imgData.forEach((v, i) => {
    histogramData[i % 4][v]++;
  });
  //console.log(histogramData);
*/

function contextToHistogram(sourceData, dest) {
    console.log("test");
    let options = {
        alias: true,
        fill: true,
        scale: "rgb", // rgb, luma, HUE, Saturation
        gradient: false
    };
    let destCtx = dest.getContext("2d");
    destCtx.clearRect(0, 0, dest.width, dest.height);

    let histogramData = [];
    histogramData.push(new Array(256).fill(0));
    histogramData.push(new Array(256).fill(0));
    histogramData.push(new Array(256).fill(0));
    histogramData.push(new Array(256).fill(0));

    sourceData.forEach((v, i) => {
        histogramData[i % 4][v]++;
    });
    
    let newCount = 0;
    let maxCount = [0, 0, 0, 0];
    for(var c = 0 ; c < 3 ; c++){
        for(var i = 0 ; i < 256; i++){
            newCount = histogramData[c][i];
            if (maxCount[0] < newCount && i % 4 != 3) {
                maxCount.shift();
                maxCount.push(newCount);
                maxCount.sort((a,b)=>a-b);
            }
        }
    }
    //console.log(histogramData);

    destCtx.clearRect(0, 0, dest.width, dest.height);


    if (options.fill) {
        destCtx.globalCompositeOperation = 'lighter';
    }

    return scaleDraw[options.scale](histogramData, dest, destCtx, options, maxCount[0]);

    /*
        if (plotFill.checked && chans.length > 1) {
          histCtx.globalCompositeOperation = 'source-over';
        }*/

}



exports.contextToHistogram = contextToHistogram;