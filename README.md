# Smart Vars
JS Script for automating fancy effects creation using CSS variables

> Note: the good description is still TBD...

This is inspired by playing around with:
1. https://github.com/VALiUMgithub/ProximityHoverEffect which is codification of https://youtu.be/TGe3pS5LqEw which is in turn inspired by https://pocketbase.io/.
2. https://codepen.io/Hyperplexed/pen/MWQeYLW which is a tutorial from this video https://youtu.be/htGfnF1zN4g which is in turn inspired by https://linear.app/features.

Thanx for your work!

With Smart Vars you can archive the same effects without writing JS code yourself (but instead using this script).

The motivation for such a need comes from B2B projects with Headless CMS at a core. 
This is when you provide some pre-made (but customizable) UI components to your (B2B) customers, and allow them to use
arbitrary HTML, CSS, and JS.
But you wish to ease/speed up their work on some popular effects (like those mentioned above) by eliminating the need to 
code custom JS logic for each such effect.

## Convention
> Note: this is a preliminary explanation, wait for a good one.

Each setup var follows this convention: `--setupSmartVar{FEATURE}-{OBJECT_NAME}`.
Where `{FEATURE}` can be one of the: `LineSegmentAngleMouseMove` or `TrackMouseMove` (only 2 for now).
While `{OBJECT_NAME}` is an arbitrary unique name (within the feature) of the object you wish to apply the effect to.

You can also notice that `{FEATURE}` itself tries to follow a smaller convention: `{GEOMETRY_OR_ACTION}{HANDLER}`.
With `{GEOMETRY_OR_ACTION}` is one of `LineSegmentAngle` (`LineSegmentDistance` upcoming) or `Track` (`GlobalTrack` upcoming).
And `{HANDLER}` is for now only `MouseMove` (`MouseScroll` upcoming).

And then if you add to the `:root` for example such var: `--setupSmartVarLineSegmentAngleMouseMove-RightEyeMorty` -
Smart Vars script will dynamically add var with a similar name: `--smartVarLineSegmentAngleMouseMove-RightEyeMorty`.
With angle in degrees between point A and point B which you defined in setup var as first and second CSS selectors.
Instead of a CSS selector - one selector can get a special constant `MOUSE_CURSOR` which, obviously, will mean the angle
will be calculated between a specified Node and a mouse cursor on mouse move.

If you add var for the second feature, then it will work a bit different.
You add `--setupSmartVarTrackMouseMove-FirstCard` and define a single CSS selector for the Node you wish to add 
mouse tracking. Then you will get 2 vars with a similar name: `--smartVarTrackMouseMoveOffsetX-FirstCard` and
`--smartVarTrackMouseMoveOffsetY-FirstCard` which be updated on your Node mouse move with event.offsetX and Y respectively.

## TODO
- [ ] Add Global Mouse Tracker
- [ ] Add Line Segment distance calculation
- [ ] Add mouse scroll handling
- [ ] Watch the rest of Hyperplexed (and others) and find good candidates for Smart Vars