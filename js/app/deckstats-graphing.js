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
                _.each(curveBarLabels, function(label, index) {

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
                    var drawPercentageLabel = s.text(x + barWidth/2, y, "").attr({
                        class: "label-draw",
                        textAnchor: "middle",
                        stroke: "#333",
                        fontSize: 14
                    });

                    curveBarGroups.push(s.g(allBar, minionBar, label, drawPercentageLabel));
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

                storedData = graphData;

                _.each(graphData.cardCounts.all, function(cardCount, index) {
                    var minionCount = graphData.cardCounts.minions[index];

                    var barHeight = cardCount * stepHeight;
                    var barGroup = curveBarGroups[index];
                    barGroup.select(".all-bar").animate({ y: (height - paddingBottom - barHeight), height: barHeight}, 50);

                    var minionBarHeight = minionCount * stepHeight;
                    barGroup.select(".minion-bar").animate({ y: (height - paddingBottom - minionBarHeight), height: minionBarHeight}, 50);

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
                var pathString = ["M" + paddingLeft + "," + Math.floor(height - paddingBottom) + " R"];
                _.each(yPoints, function(y, index) {
                    var point = { x: pathX(index), y: pathY(type, y) };
                    pathString.push(point.x + "," + point.y + " ");
                });
                pathString.push(width + "," + Math.floor(height - paddingBottom));
                // todo some kind of bug here when exceeding 25 cards, line too steep?
                return pathString.join('');
            }

            scope.$watch("data", function(newData) {
                if(newData) {
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