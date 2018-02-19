$(function () {

var DEBUG = true;

// ################################
// Helper methods

function switchScene(target) {
  $('.scene').hide();
  $('#scene-' + target).show();
}

$('.nav').click(function () {
  switchScene($(this).attr('id').split('-')[2]);
});

function take(object) {
  $('#o-' + object).addClass('taken');
  $('#i-' + object).addClass('taken');
}

$('.item').click(function () {
  var x = $(this), xid = x.attr('id');
  if (!x.hasClass('taken') || x.hasClass('used')) return;
  if (x.hasClass('selected')) {
    x.removeClass('selected');
  } else {
    // Combine items?
    var prev = getSelected();
    if ((xid == 'i-butter' && prev == 'i-boil') || (xid == 'i-boil' && prev == 'i-butter')) {
      use('i-butter');
      $('#i-boil').addClass('buttered');
    } else if ((xid == 'i-mixer' && prev == 'i-coil') || (xid == 'i-coil' && prev == 'i-mixer')) {
      use('i-coil');
      $('#i-mixer').addClass('good');
      $('#i-S').addClass('taken');
    } else {
      // Normal select
      $('.item').removeClass('selected');
      x.addClass('selected');
    }
  }
});

function getSelected() {
  return $('.item.selected').attr('id');
}

function use(x) {
  $('.item').removeClass('selected');
  $('#' + x).addClass('used');
}

// ################################
// preload

$('#o-start').click(function () {
  switchScene('kitchen');
});

// ################################
// kitchen

$('#o-mixer').click(function () {
  take('mixer');
});

$('#o-cupboard').click(function () {
  $(this).toggleClass('open');
  $('#o-sugar').toggleClass('reachable');
});

$('#o-sugar').click(function () {
  take('sugar');
});
  
$('#o-fridge').click(function () {
  $(this).toggleClass('open');
  $('#o-butter').toggleClass('reachable');
});

$('#o-oven').click(function () {
  var s = getSelected();
  if (s == 'i-foil' && $('#i-foil').hasClass('filled')) {
    $('#o-oven').addClass('filled');
    use('i-foil');
    endGame();
  } else if (DEBUG) endGame();
});

$('#o-butter').click(function () {
  take('butter');
});

// ################################
// living

var codes = { code1: 0, code2: 0, code3: 0 };
if (DEBUG) codes = { code1: 5, code2: 9, code3: 7 };

$('#code1, #code2, #code3').click(function () {
  var x = $(this), id = $(x).attr('id'), value = (codes[id] + 1) % 10;
  codes[id] = value;
  x.css('background-position', '-' + (value * 60) + 'px 0');
  if (codes.code1 == 5 && codes.code2 == 9 && codes.code3 == 8) {
    $('#o-drawer').addClass('open');
    $('#o-seed, #o-F').addClass('reachable');
  }
});

$('#o-F').click(function () {
  take('F');
});

$('#o-seed').click(function () {
  take('seed');
});

var machineMap = {'i-B': 'boil', 'i-C': 'coil', 'i-F': 'foil', 'i-S': 'soil'};

$('#o-machine-input').click(function () {
  if (!$('#o-machine-output-x').hasClass('xoil')) return;
  var s = getSelected(), output = machineMap[s];
  if (output !== undefined) {
    $('#o-machine-input-x, #o-machine-output-x').removeClass('xoil').addClass(output);
    use(s);
  }
});

$('#o-machine-output-x').click(function () {
  var s = this.className.split(/\s+/).filter(function (c) {return c.endsWith('oil');})[0];
  $('#i-' + s).addClass('taken');
  $(this).removeClass(s).addClass('xoil');
  $('#o-machine-input-x').removeClass(s).addClass('xoil');
});

$('#o-plant').click(function () {
  var x = $(this), s = getSelected();
  if (s == 'i-soil') {
    use('i-soil');
    x.addClass('soiled');
  } else if (s == 'i-seed' && x.hasClass('soiled')) {
    use('i-seed');
    x.addClass('planted').removeClass('soiled');
    $('#o-fruit').addClass('reachable');
  }
});

$('#o-fruit').click(function () {
  take('fruit');
});

// ################################
// hall

$('#o-B').click(function () {
  take('B');
});

$('#o-newton').click(function () {
  $(this).toggleClass('moved');
});

$('#o-C').click(function () {
  take('C');
});

$('#o-chicken').click(function () {
  if (!$(this).hasClass('eggless')) {
    $(this).addClass('eggless');
    $('#i-eggs').addClass('taken');
  }
});

// ################################
// tabletop

var ingredientsAdded = 0;

$('#o-big-bowl').click(function () {
  var s = getSelected();
  if (s == 'i-sugar') {
    $('#mixture-sugar, #check21, #check22, #check23, #check24').show();
    use('i-sugar');
    ingredientsAdded += 1
    if (ingredientsAdded == 4) $('#check2').show();
  } if (s == 'i-eggs') {
    $('#mixture-eggs, #check25').show();
    use('i-eggs');
    ingredientsAdded += 1
    if (ingredientsAdded == 4) $('#check2').show();
  } else if (s == 'i-boil' && $('#i-boil').hasClass('buttered')) {
    $('#mixture-butter, #check26').show();
    use('i-boil');
    ingredientsAdded += 1
    if (ingredientsAdded == 4) $('#check2').show();
  } else if (s == 'i-fruit') {
    $('#mixture-fruit, #check27').show();
    use('i-fruit');
    ingredientsAdded += 1
    if (ingredientsAdded == 4) $('#check2').show();
  } else if (s == 'i-mixer' && $('#i-mixer').hasClass('good') && ingredientsAdded == 4) {
    $('.mixture').hide();
    $('#mixture-mixed, #check3').show();
    use('i-mixer');
  } else if (s == 'i-foil') {
    $('.mixture').hide();
    $('#check4').show();
    $('#i-foil').removeClass('selected').addClass('filled');
  }
});

// ################################
// End game sequence

function endGame() {
  $('#scene-cover').fadeIn(2000, function () {
    $('#scene-congrats').show();
    $('#scene-cover').fadeOut(2000, function () {
      $('#o-happy').show();
      setTimeout(function () {
        $('#o-birthday').show();
        setTimeout(function () {
          $('#o-to').show();
          setTimeout(function () {
            $('#o-name, #o-c-picture').show();
            setTimeout(function () {
              $('#o-c-glasses').show();
            }, 2000);
          }, 1000);
        }, 1000);
      }, 1000);
    });
  });
}

// ################################
// READY!

// Handle screen resizing

$('#scene-preload').show();

});
