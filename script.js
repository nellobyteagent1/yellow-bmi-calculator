(() => {
  'use strict';

  let unit = 'metric';

  const $ = id => document.getElementById(id);
  const form = $('bmiForm');
  const metricBtn = $('metricBtn');
  const imperialBtn = $('imperialBtn');
  const heightCm = $('heightCm');
  const heightFt = $('heightFt');
  const heightIn = $('heightIn');
  const weightInput = $('weight');
  const weightUnit = $('weightUnit');
  const heightMetric = $('heightMetricInput');
  const heightImperial = $('heightImperialInput');
  const resultSection = $('resultSection');
  const resultCard = $('resultCard');
  const bmiValue = $('bmiValue');
  const bmiCategory = $('bmiCategory');
  const bmiRange = $('bmiRange');
  const scaleIndicator = $('scaleIndicator');

  function setUnit(u) {
    unit = u;
    metricBtn.classList.toggle('active', u === 'metric');
    imperialBtn.classList.toggle('active', u === 'imperial');
    heightMetric.style.display = u === 'metric' ? '' : 'none';
    heightImperial.style.display = u === 'imperial' ? 'flex' : 'none';
    weightUnit.textContent = u === 'metric' ? 'kg' : 'lbs';
    // Clear inputs on switch
    heightCm.value = '';
    heightFt.value = '';
    heightIn.value = '';
    weightInput.value = '';
    resultSection.style.display = 'none';
  }

  metricBtn.addEventListener('click', () => setUnit('metric'));
  imperialBtn.addEventListener('click', () => setUnit('imperial'));

  function getCategory(bmi) {
    if (bmi < 18.5) return { label: 'Underweight', key: 'underweight', range: 'BMI < 18.5' };
    if (bmi < 25)   return { label: 'Normal weight', key: 'normal', range: '18.5 - 24.9' };
    if (bmi < 30)   return { label: 'Overweight', key: 'overweight', range: '25.0 - 29.9' };
    return { label: 'Obesity', key: 'obese', range: 'BMI >= 30.0' };
  }

  function calcBMI() {
    let heightM, weightKg;

    if (unit === 'metric') {
      const cm = parseFloat(heightCm.value);
      weightKg = parseFloat(weightInput.value);
      if (!cm || !weightKg || cm <= 0 || weightKg <= 0) return null;
      heightM = cm / 100;
    } else {
      const ft = parseFloat(heightFt.value) || 0;
      const inches = parseFloat(heightIn.value) || 0;
      const totalIn = ft * 12 + inches;
      weightKg = parseFloat(weightInput.value);
      if (totalIn <= 0 || !weightKg || weightKg <= 0) return null;
      heightM = totalIn * 0.0254;
      weightKg = weightKg * 0.453592;
    }

    return weightKg / (heightM * heightM);
  }

  function getScalePercent(bmi) {
    // Map BMI 10-40 to 0%-100%
    const clamped = Math.max(10, Math.min(40, bmi));
    return ((clamped - 10) / 30) * 100;
  }

  function showResult(bmi) {
    const rounded = Math.round(bmi * 10) / 10;
    const cat = getCategory(bmi);

    bmiValue.textContent = rounded.toFixed(1);
    bmiValue.className = 'bmi-value text-' + cat.key;
    bmiCategory.textContent = cat.label;
    bmiCategory.className = 'bmi-category category-' + cat.key;
    bmiRange.textContent = cat.range;
    resultCard.className = 'result-card result-' + cat.key;

    scaleIndicator.style.left = getScalePercent(bmi) + '%';

    resultSection.style.display = '';
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const bmi = calcBMI();
    if (bmi === null) {
      resultSection.style.display = 'none';
      return;
    }
    showResult(bmi);
  });

  // Keyboard: Enter on any input triggers calculation
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
      }
    });
  });
})();
