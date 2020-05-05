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

var rgb2hsv = function (red, green, blue) {
    red /= 255;
    green /= 255;
    blue /= 255;

    var hue, sat, val,
        min   = Math.min(red, green, blue),
        max   = Math.max(red, green, blue),
        delta = max - min,
        val   = max;

    // This is gray (red==green==blue)
    if (delta === 0) {
      hue = sat = 0;
    } else {
      sat = delta / max;

      if (max === red) {
        hue = (green -  blue) / delta;
      } else if (max === green) {
        hue = (blue  -   red) / delta + 2;
      } else if (max ===  blue) {
        hue = (red   - green) / delta + 4;
      }

      hue /= 6;
      if (hue < 0) {
        hue += 1;
      }
    }

    return [Math.round(hue*360), Math.round(sat*100), Math.round(val*100)];
  };


function contextToVectorscope(sourceData, dest, destCtx) {
    let start = Date.now()
    let options = {
        alias: true,
        fill: true,
        scale: "rgb", // rgb, luma, HUE, Saturation
        gradient: false
    }; 
    destCtx.clearRect(0, 0, dest.width, dest.height);

    if (options.fill) {
        destCtx.globalCompositeOperation = 'lighter';
    }

    // TODO : Draw circle : https://www.w3schools.com/tags/canvas_arc.asp

    const startL = 25;
    const incL = 10;
    const centerX = dest.width / 2;
    const centerY = dest.height / 2;
    const minCenter = Math.min(centerX, centerY); // TODO : - margin
    for(var i = 0; i< sourceData.length; i += 4){
      //  if(i > 32100) continue;

        let hsl = rgb2hsv(sourceData[i], sourceData[i+1], sourceData[i+2]);

        let dist = minCenter * (hsl[1] / 100) * ( hsl[2]/100);

        let rotationGraph = 180 + 20; //20 pour vectorscopes
        y = centerY + dist * Math.cos(Math.PI * (hsl[0]+rotationGraph)/180);
        x = centerX + dist * Math.sin(Math.PI * (hsl[0]+rotationGraph)/180);

        //destCtx.arc(centerX, centerY, minCenter * hsl[1] / 100 , hsl[0], hsl[0])

        let curL = startL;
        destCtx.fillStyle = `hsl(${hsl[0]}, 100%, ${curL}%)`;
        //destCtx.stroke();
        //histCtx.fillRect(x, histCanvas.height - y, discreetWidth, y );
        destCtx.fillRect(x,y,1,1);
    }

    console.log("Done in : ", (Date.now()-start) / 1000 , "s")
    /*
        if (plotFill.checked && chans.length > 1) {
          histCtx.globalCompositeOperation = 'source-over';
        }*/

}



exports.contextToVectorscope = contextToVectorscope;