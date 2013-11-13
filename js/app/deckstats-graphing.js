app.directive("cardGraph", [function() {
    return {
        scope: {
            data: "=cardGraph"
        },
        link: function(scope, element) {
            var s = Snap("#card-graph");
            var curveBarLabels = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];
            var width, height, barWidth, stepHeight, curveBarGroups, lines;
            var paddingBottom = 22;

            function setup() {
                curveBarGroups = [];
                lines = [];
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
                    var allBar = s.rect(x, y, barWidth, 0).attr({
                        class: "all-bar",
                        fill: "#54B2FF",
                        stroke: "#333",
                        strokeWidth: 1
                    });
                    // the minion bar
                    var minionBar = s.rect(x, y, barWidth, 0).attr({
                        class: "minion-bar",
                        fill: "#428bca",
                        stroke: "#333",
                        strokeWidth: 1
                    });
                    var label = s.text(x + barWidth/2, y, "").attr({
                        textAnchor: "middle",
                        stroke: "#999",
                        fontSize: 10
                    });

                    curveBarGroups.push(s.g(label, allBar, minionBar));
                });
            }

            function update(graphData) {
                _.each(graphData.cardCounts.all, function(cardCount, index) {
                    var minionCount = graphData.cardCounts.minions[index];

                    var barHeight = cardCount * stepHeight;
                    var barGroup = curveBarGroups[index];
                    barGroup.select(".all-bar").animate({ y: (height - paddingBottom - barHeight), height: barHeight}, 50);

                    var minionBarHeight = minionCount * stepHeight;
                    barGroup.select(".minion-bar").animate({ y: (height - paddingBottom - minionBarHeight), height: minionBarHeight}, 50);

                    barGroup.select("text")
                        .attr({text: cardCount || ""})
                        .animate({ y: (height - paddingBottom - barHeight - 6)}, 50);
                });

                // update all lines
                _.each(graphData.lines, function(line) {
                    var existing = _.find(lines, function(existingLine) { return existingLine.label == line.label; });
                    if(!existing) {
                        lines.push({
                            label: line.label
                        });
                    }
                    else {
                        if(existing.path) existing.path.remove();
                        existing.path = s.path(buildPath(line.data))
                            .attr({
                                fill: "none",
                                stroke: "#999",
                                strokeWidth: 2
                            });
                    }
                });
            }

            function pathX(index) {
                return Math.floor(index * barWidth + barWidth/2);
            }
            function pathY(point) {
                return Math.floor((height - paddingBottom) * Math.max(0, (1-point)));
            }
            function buildPath(yPoints) {
                var pathString = ["M0," + Math.floor(height - paddingBottom) + " R"];
                _.each(yPoints, function(y, index) {
                    var point = { x: pathX(index), y: pathY(y) };
                    pathString.push(point.x + "," + point.y + " ");
                });
                pathString.push(width + "," + Math.floor(height - paddingBottom));
                return pathString.join('');
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