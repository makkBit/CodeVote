// 'use strict';

// (function(){

// 	var $displayPolls = $('#displayPolls');

// 	$.getJSON('/api/polls', function(data) {
			
// 		// console.log(data);
// 		// $question.text(data[0].question);
// 		// $options.append(data[0].options[0].name+"<br>");
// 		// $options.append(data[0].options[1].name+"<br>");
// 		// $author.text(data[0].author);

// 		data.forEach( function(element, index) {
			
// 			var question= data[0].question;
// 			var options= data[0].options[0].name;
// 			var author= data[0].author;

// 			$displayPolls.append(' <div class="row">
// 									<div class="col-xs-12">
//             							<div class="panel panel-default">
//                 							<div class="panel-heading text-center">
//                     							<p id="question">' + question+  '</p>
//                 							</div>
// 						                	<div class="panel-body">
// 						                    	<p id="options">' + options+ '</p>
// 						                	</div>
// 						                	<div class="panel-footer text-center">
// 						                    	<p id="author">' + author + '</p>
// 						                	</div>
// 						            	</div>
// 						        	</div>
// 						 		</div>')';


// 		});

// 	});

// })();


//  <div class="row">
//         <div class="col-xs-12">
//             <div class="panel panel-default">
//                 <div class="panel-heading text-center">
//                     <p id="question"></p>
//                 </div>
//                 <div class="panel-body">
//                     <p id="options"></p>
//                 </div>
//                 <div class="panel-footer text-center">
//                     <p id="author"></p>
//                 </div>
//             </div>
//         </div>
//  </div>