Roads - Fields Filter
==================

A library to help optimize JSON representations, by only executing logic when the associated field is requested by the client.

 - [Roads.FieldsFilter](#roadsfieldsfilter)
  - [new FieldsFilter(*dynamic* data)](#new-fieldsfilterdynamic-data)
  - [filter(*Array* fields)](#filterarray-fields)



  ## Roads.FieldsFilter

Many APIs benefit from allowing users to limit which fields they want. If a user is only trying to display title and description, there's no need to provide tons of unrelated stats and metadata. This is the first benefit of the fields filter. When provided the response data of a route, and an array of valid fields, The field filter will remove any unwanted fields.
```
    var f = new FieldsFilter({
        'test' : {
            'one' : true,
            'two' : true
        },
        'hello' : {
            'one' : true,
            'two' : true
        }
    });

    // notice test.two was not requested, so it's ignored
    // notice hello was requested, so the entire child resource is provided
    f.filter(['test.one', 'hello'])
        .then(function (response) {
            console.log(response === {
                'test' : {
                    'one' : true
                },
                'hello' : {
                    'one' : true,
                    'two' : true
                }
            });
        });
```
The second benefit is that you can provide function or promise values and the filter will expand them ONLY if the user has explicitly requested them. This allows you to avoid heavy DB queries or cache hits by intelligently structuring your responses.
```
    var f = new FieldsFilter({
        'test' : {
            'one' : function () {
                return true;
            },
            'two' : function () {
                console.log('this will never be reached!');
                return true;
            }
        },
        'hello' : {
            'one' : true,
            'two' : true
        }
    });

    // notice test.two was not requested, so it's ignored and the function is never executed
    // notice test.one was requested, so the function is executed and the response is provided
    f.filter(['test.one', 'hello'])
        .then(function (response) {
            console.log(response === {
                'test' : {
                    'one' : true
                },
                'hello' : {
                    'one' : true,
                    'two' : true
                }
            });
        });
```
### new FieldsFilter(*dynamic* data)
**Create an object to help filter down a set of data**

name        | type                               | description
 -----------|------------------------------------|---------------
 data       | dynamic                            | A piece of data that needs to be expanded and or filtered
```
    var f = new FieldsFilter({"hello" : "goodbye"});
```
### filter(*Array* fields)
**Filter down a set of data based on a whitelist of fields**

name        | type                               | description
 -----------|------------------------------------|---------------
 fields     | dynamic                            | An array of fields that should remain in the response. To represent a heirarchy use periods

Reduce the data associated with this filter object to only contain the fields provided in the "fields" array
If true is passed, the whole object will be expanded and all fields returned.
```
    var f = new FieldsFilter({
        'test' : {
            'one' : true,
            'two' : true
        },
        'hello' : {
            'one' : true,
            'two' : true
        }
    });

    f.filter(['test.one', 'hello'])
        .then(function (response) {
            console.log(response === {
                'test' : {
                    'one' : true
                },
                'hello' : {
                    'one' : true,
                    'two' : true
                }
            });
        });
 ```
