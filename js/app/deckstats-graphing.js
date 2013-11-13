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
            var paddingSide = 22;

            function setup() {

                s.clear();

                curveBarGroups = [];
                lines = [];
                width = element.width();
                height = element.height();
                barWidth = (width-paddingSide*2) / curveBarLabels.length;
                stepHeight = height / steps;
                var bar;

                // create mana curve & minion bars
                _.each(curveBarLabels, function(label, index) {

                    var x = (index * barWidth) + paddingSide;
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
                        textAnchor: "left",
                        stroke: "#999",
                        fontSize: 10
                    });

                    curveBarGroups.push(s.g(label, allBar, minionBar));
                });

                // x-axis
                s.line(paddingSide, height - paddingBottom, width - paddingSide, height - paddingBottom).attr({
                    stroke: "#555",
                    strokeWidth: 1
                });

                // y-axis
                s.line(paddingSide, height - paddingBottom, paddingSide, 0).attr({
                    stroke: "#555",
                    strokeWidth: 1
                });
                s.line(width - paddingSide, height - paddingBottom, width - paddingSide, 0).attr({
                    stroke: "#555",
                    strokeWidth: 1
                });
                for(var i = 2; i <= steps; i+=2) { // left side
                    s.text(0, height - paddingBottom - i * stepHeight, i).attr({ class: "axis-label" });
                };
                for(var i = 0; i < 10; i++) { // right side
                    s.text(width - paddingSide + 5, height - paddingBottom - i * (height/11), "." + i).attr({ class: "axis-label" });
                };

                s.selectAll(".axis-label").attr({
                    stroke: "#999",
                    fontSize: 12
                });
            }

            function update(graphData) {

                if(_.any(graphData.cardCounts.all, function(count) { return count >= steps - 2; })) {
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

                    barGroup.select("text")
                        .attr({text: cardCount || ""})
                        .animate({ y: (height - paddingBottom - barHeight - 5)}, 50);
                });

                // update all lines
                _.each(graphData.lines, function(line) {
                    var existing = _.find(lines, function(existingLine) { return existingLine.label == line.label; });
                    if(!existing) {
                        lines.push(existing = { label: line.label });
                    }

                    if(existing.path) existing.path.remove();
                    existing.path = s.path(buildPath(line.data)).attr({
                        fill: "none",
                        stroke: "#999",
                        strokeWidth: 2
                    });
                });
            }

            function pathX(index) {
                return Math.floor(index * barWidth + barWidth/2) + paddingSide;
            }
            function pathY(point) {
                return Math.floor((height - paddingBottom) * Math.max(0, (1-point)));
            }
            function buildPath(yPoints) {
                var pathString = ["M" + paddingSide + "," + Math.floor(height - paddingBottom) + " R"];
                _.each(yPoints, function(y, index) {
                    var point = { x: pathX(index), y: pathY(y) };
                    pathString.push(point.x + "," + point.y + " ");
                });
                pathString.push(width - paddingSide + "," + Math.floor(height - paddingBottom));
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