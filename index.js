const setupSmartVarPrefix = '--setupSmartVar';
const MOUSE_CURSOR = 'MOUSE_CURSOR';
const configOptionsSeparator = ',';
const entityNameSeparator = '-';

const lineSegmentAngleMouseMove = {
  setupSmartVarLineSegmentAngleMouseMove: '--setupSmartVarLineSegmentAngleMouseMove-', // value: cssSelectorFrom, cssSelectorTo
  smartVarLineSegmentAngleMouseMove: '--smartVarLineSegmentAngleMouseMove-', // value: fromToAngleDeg
}

const trackMouseMove = {
  setupSmartVarTrackMouseMove: '--setupSmartVarTrackMouseMove-', // value: trackerCssSelector
  smartVarTrackMouseMoveOffsetX: '--smartVarTrackMouseMoveOffsetX-', // value: horizontalDistancePx
  smartVarTrackMouseMoveOffsetY: '--smartVarTrackMouseMoveOffsetY-' // value: verticalDistancePx
}

const root = document.querySelector(':root');

function getGlobalCssVar(name) {
  return getComputedStyle(root).getPropertyValue(name);
}

function setGlobalCssVar(name, value) {
  root.style.setProperty(name, value);
}

function getEntityName(varName) {
  return varName.slice(varName.lastIndexOf(entityNameSeparator) + 1);
}

function angle(pointA, pointB){
  return Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
}

function toDegree(radians) {
  return (180 / Math.PI) * radians;
}

function getAllGlobalCssVars(startsWithName) {
  return Array.from(document.styleSheets)
    .filter(
      sheet =>
        sheet.href === null || sheet.href.startsWith(window.location.origin)
    )
    .reduce(
      (acc, sheet) =>
        (acc = [
          ...acc,
          ...Array.from(sheet.cssRules).reduce(
            (def, rule) =>
              (def =
                rule.selectorText === ":root"
                  ? [
                    ...def,
                    ...Array.from(rule.style).filter(name =>
                      name.startsWith(startsWithName)
                    )
                  ]
                  : def),
            []
          )
        ]),
      []
    );
}

function isXYPoint(point) {
  return point && point.x && Number.isFinite(point.x) && point.y && Number.isFinite(point.y);
}

function isMouseMoveConfigValid(pointA, pointB) {
  return (isXYPoint(pointA) || pointA === MOUSE_CURSOR) && (isXYPoint(pointB) || pointB === MOUSE_CURSOR);
}

// TODO: add distance https://p5js.org/reference/#/p5/dist (with map https://p5js.org/reference/#/p5/map) support.
function initLineSegmentAngleMouseMove() {
  const angleMouseMoveLineSegments = getAllGlobalCssVars(lineSegmentAngleMouseMove.setupSmartVarLineSegmentAngleMouseMove);
  const angleMouseMoveLineSegmentsNames = angleMouseMoveLineSegments.map(getEntityName);
  if (angleMouseMoveLineSegmentsNames.length > 0) {
    angleMouseMoveLineSegmentsNames.forEach(lineSegment => {
      const lineSegmentConfig = getGlobalCssVar(`${lineSegmentAngleMouseMove.setupSmartVarLineSegmentAngleMouseMove}${lineSegment}`);
      let pointA, pointB;
      lineSegmentConfig.split(configOptionsSeparator).forEach((option, index) => {
        const selector = option.trim();
        if (selector && selector !== MOUSE_CURSOR) {
          const currentPointContainer = document.querySelector(selector);
          if (currentPointContainer) {
            const { left, top, width, height} = currentPointContainer.getBoundingClientRect();
            let currentPoint = {
              x: left + width / 2,
              y: top + height / 2
            }
            if (index === 0) {
              pointA = currentPoint;
            } else {
              pointB = currentPoint;
            }
          }
        } else if (selector === MOUSE_CURSOR) {
          if (index === 0) {
            pointA = MOUSE_CURSOR;
          } else {
            pointB = MOUSE_CURSOR;
          }
        }
      });
      if (isMouseMoveConfigValid(pointA, pointB)) {
        document.addEventListener('mousemove', ({ clientX: mouseX, clientY: mouseY}) => {
          const mouse = {
            x: mouseX,
            y: mouseY
          };
          const angleDeg = toDegree(angle(pointA === MOUSE_CURSOR ? mouse : pointA, pointB === MOUSE_CURSOR ? mouse : pointB));
          setGlobalCssVar(`${lineSegmentAngleMouseMove.smartVarLineSegmentAngleMouseMove}${lineSegment}`, `${angleDeg}deg`);
        })
      } else {
        console.warn(`${lineSegment} configuration is invalid. Convention is: ` +
          `\`${lineSegmentAngleMouseMove.setupSmartVarLineSegmentAngleMouseMove}{LINE_SEGMENT_NAME}: ` +
          `{POINT_A_SELECTOR}, {POINT_B_SELECTOR};\` ` +
          `CSS selectors should return existing node or should be equal to \`MOUSE_CURSOR\` string constant.`);
      }
    });
  }
}

function initTrackMouseMove() {
  const trackers = getAllGlobalCssVars(trackMouseMove.setupSmartVarTrackMouseMove);
  const trackersNames = trackers.map(getEntityName);
  if (trackersNames.length > 0) {
    trackersNames.forEach(trackerName => {
      const trackerConfig = getGlobalCssVar(`${trackMouseMove.setupSmartVarTrackMouseMove}${trackerName}`);
      const tracker = document.querySelector(trackerConfig);
      if (tracker) {
        tracker.addEventListener('mousemove', ({ offsetX, offsetY }) => {
          setGlobalCssVar(`${trackMouseMove.smartVarTrackMouseMoveOffsetX}${trackerName}`, `${offsetX}px`);
          setGlobalCssVar(`${trackMouseMove.smartVarTrackMouseMoveOffsetY}${trackerName}`, `${offsetY}px`);
        });
      } else {
        console.warn(`${trackerName} configuration is invalid. Convention is: ` +
          `\`${trackMouseMove.setupSmartVarTrackMouseMove}{TRACKER_NAME}: {TRACKER_SELECTOR};\` ` +
          `CSS selectors should return existing node.`);
      }
    });
  }
}

function initSmartVars() {
  const allSmartVars = getAllGlobalCssVars(setupSmartVarPrefix);

  if (allSmartVars.some(smartVar => smartVar.startsWith(trackMouseMove.setupSmartVarTrackMouseMove))) {
    initTrackMouseMove();
  } else if (allSmartVars.some(smartVar => smartVar.startsWith(lineSegmentAngleMouseMove.setupSmartVarLineSegmentAngleMouseMove))) {
    initLineSegmentAngleMouseMove();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSmartVars);
} else {
  initSmartVars();
}
