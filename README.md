# MonitorJS
MonitorJS is a lightweight javascript plugin to track your scripts performances.

You may use it to seek & destroy code that is slowing down your app.
___

**Note**: At the moment, MonitorJS only track time consumption. It may track memory usage in the future.

MonitorJS creates a global variable `Monitor` from which you can call functions described below.

### Recording Process

**Note**: 
Some functions takes an optionnal parameter `recordName`. 
This value is used to refer to the record (when recording or reading a value).
If `recordName` is not provided MonitorJS will try to get the caller function name to use it instead.
Even if it is optionnal **it is recommended to provide a record name** since anonymous functions or strict mode can cause issues.


* `Start(recordName : string)`
  > >`recordName`: Optionnal (but recommended) **string** parameter

  > Description: Start recording.

* `Stop(recordName : string)`
  > >`recordName`: Optionnal (but recommended) **string** parameter

  > Description: Stop recording.
  
* `Cancel(recordName : string)`
  > >`recordName`: Optionnal (but recommended) **string** parameter

  > Description: Cancel recording.

* `Clear(recordName : string)`
  > >`recordName`: Mandatory **string** parameter

  > Description: Delete this record.
  
* `ClearAll()`
  > Description: Delete all records.

**Performance**: The recording process is pretty fast (< 1 microsecond to Start and Stop).

### Reading Process

* `Get(recordName : string)`
  > >`recordName`: Mandatory **string** parameter

  > Description: Get the specified record (see below for record object format)
  
* `GetAll()`
  > Description: Get all records (see below for record object format)

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

### Examples

* **Track time consumption of a function in your app lifecycle:**
```js
function SomeFunction() {
  Monitor.Start(); // recordName will be "SomeFunction"
  
  // ...
  // your code
  // ...
  
  Monitor.Stop();
}
```

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
Push avg time 0.48 ns
Unshift avg time 3.16 ns
```
