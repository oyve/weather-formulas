type CosinorParams = {
    mesor: number;
    amplitude: number;
    acrophase: number; // in hours
};

type Reading = {
    timestamp: Date;
    pressure: number;
};

function fitCosinorModel(data: Reading[]): CosinorParams | null {
    // Convert timestamps to hours since start
    const startTime = new Date(data[0].timestamp).getTime();
    const times = data.map(d => (new Date(d.timestamp).getTime() - startTime) / (1000 * 60 * 60));

    const duration = Math.max(...times) - Math.min(...times);
    if (duration < 24) {
      console.warn("Insufficient data: need more than 24 hours of readings.");
      return null;
    }

    const pressures = data.map(d => d.pressure);

    const omega = 2 * Math.PI / 24;

    // Build normal equations
    let Sx = 0, Sy = 0, Sxx = 0, Sxy = 0, Syy = 0;
    let sumY = 0;

    for (let i = 0; i < times.length; i++) {
        const t = times[i];
        const y = pressures[i];
        const cosTerm = Math.cos(omega * t);
        const sinTerm = Math.sin(omega * t);

        Sx += cosTerm;
        Sy += sinTerm;
        Sxx += cosTerm * cosTerm;
        Sxy += cosTerm * y;
        Syy += sinTerm * y;
        sumY += y;
    }

    const n = times.length;
    const M = sumY / n;

    const A_cos = (Sxy - Sx * M) / (Sxx - Sx * Sx / n);
    const A_sin = (Syy - Sy * M) / (Sxx - Sy * Sy / n); // approximate

    const amplitude = Math.sqrt(A_cos ** 2 + A_sin ** 2);
    const acrophase = (-Math.atan2(A_sin, A_cos) * 24) / (2 * Math.PI); // in hours

    return {
        mesor: M,
        amplitude,
        acrophase: (acrophase + 24) % 24 // wrap to [0, 24)
    };
}

function evaluateDiurnalAtHour(
    hour: number,
    curve: CosinorParams
  ): number {
    const radians = (2 * Math.PI * hour) / 24;
    return (
      curve.mesor +
      curve.amplitude * Math.cos(radians - curve.acrophase)
    );
  }

//   const pressureAt8am = evaluateDiurnalAtHour(8, fittedCurve);

// function generateDiurnalCurveSamples(
//     curve: CosinorParams
//   ): { hour: number; pressure: number }[] {
//     const samples: { hour: number; pressure: number }[] = [];
  
//     for (let hour = 0; hour < 24; hour++) {
//       const pressure = evaluateDiurnalAtHour(hour, curve);
//       samples.push({ hour, pressure });
//     }
  
//     return samples;
//   }

// const samples = generateDiurnalCurveSamples(fittedCurve);
// console.log(samples); // array of { hour, pressure } from 0 to 23

function detectProminentExtremes(
    readings: Reading[],
    topN: number = 2
  ): { peaks: Reading[]; valleys: Reading[] } {
    const localPeaks: Reading[] = [];
    const localValleys: Reading[] = [];
  
    for (let i = 1; i < readings.length - 1; i++) {
      const prev = readings[i - 1].pressure;
      const curr = readings[i].pressure;
      const next = readings[i + 1].pressure;
  
      if (curr > prev && curr > next) {
        localPeaks.push(readings[i]);
      } else if (curr < prev && curr < next) {
        localValleys.push(readings[i]);
      }
    }
  
    // Sort by pressure to get most prominent
    const peaks = localPeaks
      .sort((a, b) => b.pressure - a.pressure)
      .slice(0, topN);
    const valleys = localValleys
      .sort((a, b) => a.pressure - b.pressure)
      .slice(0, topN);
  
    return { peaks, valleys };
  }

  
  type MonthlyGrouped = {
    [month: number]: Reading[];
  };
  
  function groupReadingsByMonth(readings: Reading[]): MonthlyGrouped {
    const grouped: MonthlyGrouped = {};
  
    readings.forEach((reading) => {
      const month = reading.timestamp.getMonth(); // 0 = Jan, 11 = Dec
      if (!grouped[month]) {
        grouped[month] = [];
      }
      grouped[month].push(reading);
    });
  
    return grouped;
  }

//   const monthlyGroups = groupReadingsByMonth(allReadings);

// for (const month in monthlyGroups) {
//   const readings = monthlyGroups[+month];
//   const curve = fitDiurnalCurve(readings);
//   // store or plot the curve for that month
// }
  