if (!("prop" in $.fn)) { $.fn.prop = $.fn.attr; }

var o = {
  objName: "remember_state_test_data"
};
var setup = function(opts) {
  opts = opts || {};
  return $("#qunit-fixture").find("form").rememberState($.extend(true, {}, o, opts));
};
var triggerUnload = function() {
  $(window).trigger("unload");
};

test("Requirements", 3, function() {
  ok($, "$");
  ok($.fn.rememberState, "$.fn.rememberState");
  ok((typeof window.localStorage.setItem === "function"), "localStorage supported");
});

module("rememberState", {
  setup: function() {
    delete localStorage[o.objName];
  }
});

test("It should have no data in localStorage", function() {
  ok(!localStorage[o.objName]);
});

test("Value in text field should save state", function() {
  var $form = setup();
  $form.find("#first_name").val("Shane");
  triggerUnload();
  ok(/Shane/.test(JSON.parse(localStorage.getItem(o.objName))[0].value), "First name saved");
  $form.find("#last_name").val("Riley");
  ok(!(/Riley/.test(JSON.parse(localStorage.getItem(o.objName))[0].value)), "Last name not saved");
});

test("Value in radio should save state", function() {
  var $form = setup();
  $form.find("#gender_male").prop("checked", true);
  triggerUnload();
  ok(/Male/.test(localStorage[o.objName]), "Gender saved");
  $form.find("#gender_female").prop("checked", true);
  ok(!(/Female/.test(localStorage[o.objName])), "Gender not saved");
});

test("Value in select box should save state", function() {
  var $form = setup();
  $form.find("#marital_status option:contains(Married)").prop("selected", true);
  triggerUnload();
  ok(/Married/.test(localStorage[o.objName]), "Marital status saved");
  $form.find("#marital_status option:contains(Single)").prop("selected", true);
  ok(!(/Single/.test(localStorage[0])), "Marital status not saved");
});

test("Value in checkbox should save state", function() {
  var $form = setup();
  $form.find("[name=video_games]").prop("checked", true);
  triggerUnload();
  ok(/Video/.test(localStorage[o.objName]), "Video games saved");
  $form.find("[name=dendrophilia]").prop("checked", true);
  ok(!(/Dendro/.test(localStorage[o.objName])), "Dendrophilia not saved");
});

test("Multiselects restore state", function() {
  var $form = setup(),
      $opts = $form.find("[multiple] option");
  $opts.eq(0).prop("selected", true);
  $opts.eq($opts.length - 1).prop("selected", true);
  triggerUnload();
  ok(/m_w/.test(localStorage[o.objName]), "Multiple selected options saved");
  ok(!(/m_m/.test(localStorage[o.objName])), "Not selected option not saved");
});

test("Value in datetime should save state", function() {
  var $form = setup();
  $form.find("#datetime").val("1901-01-01T06:00:00");
  triggerUnload();
  ok(/1901-01-01T06:00:00/.test(localStorage[o.objName]), "Datetime saved");
});

test("Value in datetime-local should save state", function() {
  var $form = setup();
  $form.find("#datetime-local").val("1901-01-01T06:00:00-06:00");
  triggerUnload();
  ok(/1901-01-01T06:00:00-06:00/.test(localStorage[o.objName]), "Datetime-local saved");
});

test("Gender field should be ignored", function() {
  var $form = setup({ ignore: ["gender"] });
  $form.find("#gender_female").attr("checked", true);
  triggerUnload();
  ok(!/Female/.test(localStorage[o.objName]), "Gender not saved");
});

test("Plugin should not remember state after destroy method called", function() {
  var $form = setup();
  $form.find("#first_name").val("Shane");
  $form.rememberState("destroy", true);
  triggerUnload();
  ok(!localStorage[o.objName], "Form not saved");
});
