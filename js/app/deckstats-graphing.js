app.directive("cardGraph", ["$rootScope", function($rootScope) {
    return {
        scope: {
            data: "=cardGraph"
        },
        link: function(scope, element) {
            var s = Snap("#card-graph");
            var storedData;
            var curveBarLabels = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];
            var width, height, barWidth, stepHeight, curveBarGroups, lines;
            var steps = 12;
            var paddingBottom = 22;
            var paddingLeft = 22;

            function setup() {

                s.clear();

                curveBarGroups = [];
                lines = [];
                width = element.width();
                height = element.height();
                barWidth = (width-paddingLeft) / curveBarLabels.length;
                stepHeight = height / steps;
                var bar;

                // create mana curve & minion bars
                _.forEachRight(curveBarLabels, function(label, index) {

                    var x = (index * barWidth) + paddingLeft;
                    var y = height;

                    // axis labels
                    s.text(x + barWidth/2, height - 6, label).attr({ class: "axis-label" });

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
                        class: "label",
                        textAnchor: "left",
                        stroke: "#999",
                        fontSize: 10
                    });

                    // all bar tooltip
                    var allTooltip = s.text(x + barWidth/2, 50, "").attr({
                        class: "all-tooltip",
                        textAnchor: "left",
                        stroke: "#333",
                        fontSize: 10,
                        visibility: "hidden"
                    });
                    allBar.mousemove(function(evt) {
                        allTooltip.attr({ x: evt.layerX, y: evt.layerY, visibility: "visible" });
                    })
                    allBar.mouseout(function() {
                        allTooltip.attr({ visibility: "hidden" });
                    });

                    // minion bar tooltip
                    var minionTooltip = s.text(x + barWidth/2, 50, "").attr({
                        class: "minion-tooltip",
                        textAnchor: "left",
                        stroke: "#333",
                        fontSize: 10,
                        visibility: "hidden",
                        zIndex: 15000
                    });
                    minionBar.mousemove(function(evt) {
                        minionTooltip.attr({ x: evt.layerX, y: evt.layerY, visibility: "visible" });
                    })
                    minionBar.mouseout(function() {
                        minionTooltip.attr({ visibility: "hidden" });
                    });

                    // draw percentage label
                    var drawPercentageLabel = s.text(x + barWidth/2, y, "").attr({
                        class: "label-draw",
                        textAnchor: "middle",
                        stroke: "#333",
                        fontSize: 14
                    });

                    curveBarGroups.push(s.g(allBar, minionBar, label, drawPercentageLabel, allTooltip, minionTooltip));
                });

                // x-axis
                s.line(paddingLeft, height - paddingBottom, width, height - paddingBottom).attr({
                    stroke: "#555",
                    strokeWidth: 1
                });

                // y-axis
                s.line(paddingLeft, height - paddingBottom, paddingLeft, 0).attr({
                    stroke: "#555",
                    strokeWidth: 1
                });
                for(var i = 2; i <= steps; i+=2) { // left side
                    s.text(0, height - paddingBottom - i * stepHeight, i).attr({ class: "axis-label" });
                };

                s.selectAll(".axis-label").attr({
                    stroke: "#999",
                    fontSize: 12
                });
            }

            function update(graphData) {

                var maxCardValue = _.max(graphData.cardCounts.all);
                var maxLineValue = _.max(_.flatten(graphData.lines, "data"));
                if(maxCardValue > steps - 3 || maxLineValue > steps - 3) {
                    steps += 5;
                    setup();
                    return update(graphData);
                }
                if(maxCardValue < steps - 5) {
                    // todo below causes infinite loop, but something should be done to downscale the graph
                    //steps -= 5;
                    //setup();
                    //return update(graphData);
                }

                storedData = graphData;

                _.forEachRight(graphData.cardCounts.all, function(cardCount, index) {

                    var minionCount = graphData.cardCounts.minions[index];

                    var barHeight = cardCount * stepHeight;
                    var barGroup = curveBarGroups[index];
                    barGroup.select(".all-bar").animate({ y: (height - paddingBottom - barHeight), height: barHeight}, 50);

                    var minionBarHeight = minionCount * stepHeight;
                    barGroup.select(".minion-bar").animate({ y: (height - paddingBottom - minionBarHeight), height: minionBarHeight}, 50);

                    barGroup.select(".all-tooltip").attr({text: cardCount == 1 ? "1 non minion" : cardCount - minionCount + " non minions"});
                    barGroup.select(".minion-tooltip").attr({text: minionCount == 1 ? "1 minion" : minionCount + " minions"});

                    barGroup.select(".label")
                        .attr({text: cardCount || ""})
                        .animate({ y: (height - paddingBottom - barHeight - 5)}, 50);

                    var turnDrawPercentage = graphData.cardCounts.turnDrawPercentages[index];

                    barGroup.select(".label-draw")
                        .attr({text: turnDrawPercentage ? turnDrawPercentage + "%" : ""})
                        .animate({ y: (height - paddingBottom - barHeight/2)}, 50);
                });

                // update all lines
                _.each(lines, function(line) { line.touched = false; });
                _.each(graphData.lines, function(line) {
                    var existing = _.find(lines, function(existingLine) { return existingLine.label == line.label; });
                    if(!existing) {
                        lines.push(existing = { label: line.label });
                    }

                    if(existing.path) existing.path.remove();
                    existing.path = s.path(buildPath(line.type, line.data)).attr({
                        fill: "none",
                        stroke: line.color,
                        strokeWidth: 2
                    });
                    existing.touched = true;
                });

                _.each(_.select(lines, function(line) { return !line.touched; }), function(line) {
                    line.path.remove();
                });
            }

            function pathX(index) {
                return Math.floor(index * barWidth + barWidth/2) + paddingLeft;
            }
            function pathY(type, point) {
                if(type == "percentage") {
                    return Math.floor((height - paddingBottom) * Math.max(0, (1-point)));
                }
                if(type == "number") {
                    return Math.floor((height - paddingBottom) - stepHeight * point);
                }
            }
            function buildPath(type, yPoints) {
                // Catmull-Rom curve
                var previousWasStraight = true;
                var pathString = ["M" + paddingLeft + "," + Math.floor(height - paddingBottom) + " "];
                _.each(yPoints, function(y, index) {

                    var point = { x: pathX(index), y: pathY(type, y) };

                    if(y == 0 && (index == 0 || yPoints[index-1] == 0)) { // straight line
                        var point = { x: pathX(index), y: pathY(type, y) };
                        pathString.push("L" + point.x + "," + point.y + " ");
                        previousWasStraight = true;
                    }
                    else {
                        if(previousWasStraight) {
                            pathString.push("R");
                            previousWasStraight = false;
                        }
                        pathString.push(point.x + "," + point.y + " ");
                    }
                });

                if(_.last(yPoints) == 0) {
                    pathString.push("L" + width + "," + Math.floor(height - paddingBottom));
                }
                else {
                    pathString.push(width + "," + Math.floor(height - paddingBottom));
                }
                return pathString.join('');
            }

            scope.$watch("data", function(newData) {
                if(newData) {
                    // The data we get is in the expected order of 1, 2, 3, 4... cost (sorted by cost)
                    // However, in order to make our tooltips show up nicely, the bar needs to be add in reverse
                    // So, reverse all of the data so we do the bars starting with the larger cost first
                    newData.cardCounts.all = newData.cardCounts.all.reverse();
                    newData.cardCounts.minions = newData.cardCounts.minions.reverse();
                    newData.cardCounts.turnDrawPercentages = newData.cardCounts.turnDrawPercentages.reverse();

                    update(newData);
                }
            });
            $rootScope.$watch("windowWidth", function() {
                setup();
                if(storedData) update(storedData);
            });
        }
    };
}]);