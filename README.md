# MonitorJS
MonitorJS is a lightweight javascript plugin to track your scripts performances.

You may use it to seek & destroy code that is slowing down your app.
___

>**Note**: 
> * At the moment, MonitorJS only track time consumption. It may track memory usage in the future.

MonitorJS creates a global variable `Monitor` from which you can call functions described below.

### How to use it on your website

Include `monitorjs.js` or `monitorjs.min.js` in your HTML :

    <script type="text/javascript" src="monitorjs.min.js"></script>

You are ready to go !

### Recording Process

**Note**: 
Some functions takes an optionnal parameter `recordName`. 
This value is used to refer to the record (when recording or reading a value).
If `recordName` is not provided MonitorJS will try to get the caller function name to use it instead.
Even if it is optionnal **it is recommended to provide a record name** since anonymous functions or strict mode can cause issues.


* `Start(blockName? : String)`
  > Start recording.

  > `blockName`: Optionnal (but recommended) **string** parameter
  
  > returns: Object which should be used as argument to Stop or Cancel recording (see Section "Concurrent Access" below)


* `Stop(input? : String | Object)`
  > Stop recording.

  > `input`: Optionnal (but recommended) **string** or **object** parameter (see Section "Concurrent Access" below)

  
* `Cancel(input? : String | Object)`
  > Cancel recording.

  > `input`: Optionnal (but recommended) **string** or **object** parameter (see Section "Concurrent Access" below)

* `Clear(blockName : String)`
  > Delete this record.

  > >`blockName`: Mandatory **string** parameter
  
* `ClearAll()`
  > Delete all records.

**Performance**: The recording process is pretty fast (< 1 microsecond to Start and Stop).

### Reading Process

* `Get(blockName : string)`
  > Get the specified record (see below for record object format)

  > >`blockName`: Mandatory **string** parameter
  
* `GetAll()`
  > Get all records (see below for record object format)

### Record Object

A record is structured as follow:

```js
{
  // Record name (string)
  name: "ExampleRecord",
  // Total time consumed (number)
  total_time: 0,
  // Number of start+stop cycle (number)
  call_count: 0
}
```

### Basic Examples

* Simplest :

```js
function SomeFunction() {
  Monitor.Start(); // recordName will be "SomeFunction"
  
  // ...
  // your code
  // ...
  
  Monitor.Stop();
}

// Get the record anytime :
console.log(Monitor.Get("SomeFunction"));
```
**Warning:** unparameterized recording should not be used in strict mode, anonymous functions or concurrent environnement (eg if "SomeFunction" may be called more than once at a time - see section "Concurrent Access").

#### String parameterized recording :

```js
function SomeFunction() {
  Monitor.Start("Main"); // recordName will be "Main"
  
  for (let i = 0; i < 1e3; i++) {
    Monitor.Start("Loop");
    // loop stuff
    // ...
    Monitor.Stop("Loop");
  }
  // ...
  Monitor.Stop("Main");
}
```
**Warning:** string parameterized recording should not be used in concurrent environnement (eg if "SomeFunction" may be called more than once at a time - see section "Concurrent Access").

#### Concurrent safe recording :
```js
function ConcurrentFunction() {
  var mId = Monitor.Start("Main"); // recordName will be "Main"
  // ...
  Monitor.Stop(mId);
}
```

###Concurrent Access

If you are using MonitorJS in a concurrent environement you should always call Stop and Cancel with the value returned by Start.

This object is used by MonitorJS to keep track of the current context.

When you call Stop without this object, it will stop the oldest timer. But this behavior may lead to errors.

```js
function SomeFunction() {
  Monitor.Start("Main"); // recordName will be "Main"
  
  // run concurrent things:
  setTimeout(()=> {
    doThings(1e3);
  }, 1);
  setTimeout(()=> {
    doThings(1);
  }, 1);
  
  Monitor.Stop("Main");
}

function doThings(x) {
  var mId_doThings = Monitor.Start("doThings");
  for (let i = 0; i < x; i++) {
    var mId_loop = Monitor.Start("Loop");
    // loop stuff
    // ...
    Monitor.Stop(mId_loop);
  }
  Monitor.Stop(mId_doThings);
}
```
**Note:** this code is safe because we provide context object to Monitor.Stop where there is concurrent access.

*section in progress*

### More Examples

* **Show stats of every records:**
```js
function ShowRecords() {
  var records = Monitor.GetAll();
  for (var i = 0; i < records.length; i++) {
    var record = records[i];
    console.log(record.name + " : called " + record.call_count 
        + " times // took " + record.total_time.toFixed(2) + " ms // avg time : " 
        + (record.total_time / record.call_count).toFixed(2) + " ms");
  }
}
```

* **Compare efficiency:**

`Array.push` versus `Array.unshift`

```js
window.addEventListener("load",function() {
  RunTest();
  LogPushVersusUnshift();
});

function RunTest() {
  var myArray = new Array();
  for(var i = 0; i < 1e4; i++) {
    Monitor.Start("Array.unshift");
    myArray.unshift(i);
    Monitor.Stop("Array.unshift");
    Monitor.Start("Array.push");
    myArray.push(i);
    Monitor.Stop("Array.push");
  }
}

function LogPushVersusUnshift() {
  var pushRecord = Monitor.Get("Array.push");
  var unshiftRecord = Monitor.Get("Array.unshift");
  console.info("Push avg time " + (1000 * pushRecord.total_time / pushRecord.call_count).toFixed(2) + " microsec");
  console.info("Unshift avg time " + (1000 * unshiftRecord.total_time / unshiftRecord.call_count).toFixed(2) + " microsec");
}
```

FYI :
```
Push avg time 0.48 microseconds
Unshift avg time 3.16 microseconds
```
