/* global $, control, data */
'use strict';

if (JSON.parse(control.getPlatformInfo()).container === 'Chrome') {
    console.log('Welcome to Tables debugging in Chrome!');
    $.ajax({
        url: control.getFileAsUrl('output/debug/geotagger_data.json'),
        async: false,  // do it first
        success: function(dataObj) {
            window.data.setBackingObject(dataObj);
        }
    });
}

$(document).ready(setup);
//handles events from html page
    
function setup() {
    displayGroup();
}
        
function handleClick(index) {
    var tableId = data.getTableId();
    var rowId = data.getRowId(index);
    control.openDetailView(tableId, rowId, null);
}

function displayGroup() {
    for (var i = 0; i < data.getCount(); i++) {
        /*    Creating the item space    */
        var itemHeading = $('<div>');
        var headingText = $('<p>');
        headingText.text(data.getData(i, 'Description'));
        itemHeading.attr('class', 'heading');
        
        var srcMimeUri = data.getData(i, 'Image');
        var src = '';
        if (srcMimeUri !== null ) {
            var mimeUriObject = JSON.parse(srcMimeUri);
            var uriRelative = mimeUriObject.uri;
            var uriAbsolute = control.getFileAsUrl(uriRelative);
            src = uriAbsolute;
        }

        var thumbnail = $('<img>');
        thumbnail.attr('src', src);
        thumbnail.attr('class', 'thumbnail');
        var buffer = $('<p>');
        buffer.attr('class', 'clear');
        itemHeading.append(thumbnail);
        itemHeading.append(headingText);
        itemHeading.append(buffer);
        
        var detailContainer = $('<div>');
        detailContainer.attr('onclick', 'handleClick(' + i + ')');
        detailContainer.attr('class', 'detail_container');
        detailContainer.attr('id', 'item_' + i);
        $(detailContainer).hide();
                  
        var loc = data.getData(i,'Location');
        var lat = '';
        var lng = '';
        if ( loc !== null ) {
            var splitLoc = loc.split(',');
            lat = splitLoc[0];
            lng = splitLoc[1];
        }

        var field1 = $('<p>');
        field1.text('Latitude: ' + lat);
        var field2 = $('<p>');
        field2.text('Longitude: ' + lng);

        detailContainer.append(field1);
        detailContainer.append(field2);
        
        $(itemHeading).click(function()
        {
            if($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                $(this).addClass('selected');
            }
            $(this).next(detailContainer).slideToggle('fast');
        });
        
        $('#wrapper').append(itemHeading);
        $('#wrapper').append(detailContainer);
    }
}