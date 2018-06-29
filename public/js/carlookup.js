function searchClick() {
  const reg = $('.regText').val();

  $.ajax({
    url: `/vehicle/${reg}`,
    type: 'GET',
    complete(data) {
      if (data !== null) {
        const car = JSON.parse(data.responseText);
        $('#carmake').html(car.Manufacturer);
        $('#carmodel').html(car.Model);
        $('#carstyle').html(car.BodyStyle.Description);
        $('#cardoors').html(car.NumberOfDoors);
        $('#carfuel').html(car.FuelType.Description);
        $('#cartrans').html(car.Transmission.Description);

        $('.specificVehicleNotFound').hide();
        $('.specificVehicle').show();
      } else {
        $('.specificVehicleNotFound').show();
        $('.specificVehicle').hide();
      }
    },
  });
}

function manualLookupClick() {
  $('.specificVehicle').hide();
  $.ajax({
    url: '/manufacturers',
    dataType: 'json',
    type: 'GET',
    complete(data) {
      if (data !== null) {
        $('.manualLookup').show();

        const manufacturers = JSON.parse(data.responseText);
        manufacturers.sort();

        const $dropdown = $('#manufacturers');
        $dropdown.append($('<option />').val(0).text('Select manufacturer'));
        $.each(manufacturers, (i, v) => {
          $dropdown.append($('<option />').val(v).text(v));
        });
      }
    },
  });
}

function manufacturerChanged() {
  $('.modelRow').show();
  $('.trimRow').hide();
  $('.abiRow').hide();
  const manufacturer = $('#manufacturers option:selected').val();

  if (manufacturer === '0') {
    // Don't do anything if the choice is the 'please select message'
    $('.modelRow').hide();
    $('.trimRow').hide();
    $('.abiRow').hide();
    return;
  }

  $.ajax({
    url: `/models/${manufacturer}`,
    dataType: 'json',
    type: 'GET',
    complete(data) {
      if (data !== null) {
        $('.manualLookup').show();

        const models = JSON.parse(data.responseText);
        models.sort();

        const ddown = $('#models');
        ddown.find('option').remove();
        ddown.append($('<option />').val(0).text('Select model'));
        $.each(models, (i, v) => {
          ddown.append($('<option />').val(v).text(v));
        });
      }
    },
  });
}

function modelChanged() {
  $('.trimRow').show();
  $('.abiRow').hide();
  const manufacturer = $('#manufacturers option:selected').val();
  const model = $('#models option:selected').val();

  if (model === '0') {
    // Don't do anything if the choice is the 'please select message'
    $('.trimRow').hide();
    $('.abiRow').hide();
    return;
  }

  $.ajax({
    url: `/trims/${manufacturer}/${model}`,
    dataType: 'json',
    type: 'GET',
    complete(data) {
      if (data !== null) {
        const trims = JSON.parse(data.responseText);
        trims.sort();

        const dropdown = $('#trims');
        dropdown.find('option').remove();
        dropdown.append($('<option />').val(0).text('Select trim'));
        $.each(trims, (i, v) => {
          dropdown.append($('<option />').val(v[0]).text(v[1]));
        });
      }
    },
  });
}

function trimChanged() {
  const abiCode = $('#trims option:selected').val();

  if (abiCode === '0') {
    // Don't do anything if the choice is the 'please select message'
    $('.abiRow').hide();
    return;
  }

  $('.abiRow').show();
  $('#abicode').html(abiCode);
}

function getWeather() {
  $.ajax({
    url: '/weather',
    dataType: 'json',
    type: 'GET',
    complete(data) {
      alert(JSON.stringify(data));
      if (data !== null) {
        $('#weatherDisplay').html(data);
      }
    },
  });
}

$(() => {
  getWeather();
  $('#searchButton').click(searchClick);
  $('#manualLookupButton').click(manualLookupClick);
  $('#manufacturers').change(manufacturerChanged);
  $('#models').change(modelChanged);
  $('#trims').change(trimChanged);
});
