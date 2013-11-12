app.directive("cardGraph", [function() {
    return {
        scope: {
            data: "=cardGraph"
        },
        link: function(scope, element) {
            var s = Snap("#card-graph");
            var curveBarLabels = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];
            var width, height, barWidth, stepHeight, curveBars, minionBars;
            var paddingBottom = 22;

            function setup() {
                curveBars = [];
                minionBars = [];
                width = element.width();
                height = element.height();
                barWidth = width / curveBarLabels.length;
                stepHeight = height / 12;
                var bar;

                // create mana curve & minion bars
                _.each(curveBarLabels, function(label, index) {

                    var x = index * barWidth;
                    var y = height;

                    // x-axis
                    s.text(x + barWidth/2, height - 6, label).attr({
                        textAnchor: "middle"
                    });
                    s.line(0, height - paddingBottom, width, height - paddingBottom).attr({
                        stroke: "#555",
                        strokeWidth: 1
                    });

                    // y-axis
                    // todo label y-axis

                    // the curve/all bar
                    bar = s.rect(x, y, barWidth, 0).attr({
                        fill: "#54B2FF",
                        stroke: "#333",
                        strokeWidth: 1
                    });
                    curveBars.push(bar);

                    // the minion bar
                    bar = s.rect(x, y, barWidth, 0).attr({
                        fill: "#428bca",
                        //fillOpacity: "75%",
                        stroke: "#333",
                        strokeWidth: 1
                    });
                    minionBars.push(bar);
                });
            }

            function update(graphData) {
                _.each(graphData.cardCounts.all, function(cardCount, index) {
                    var minionCount = graphData.cardCounts.minions[index];

                    var barHeight = cardCount * stepHeight;
                    curveBars[index].animate({ y: (height - paddingBottom - barHeight), height: barHeight}, 50);

                    var minionBarHeight = minionCount * stepHeight;
                    minionBars[index].animate({ y: (height - paddingBottom - minionBarHeight), height: minionBarHeight}, 50);
                });
            }

            scope.$watch("data", function(newData) {
                if(newData) {
                    update(newData);
                }
            });

            setup(); // todo run on window resize
        }
    };
}]);