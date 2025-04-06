import "vitest-axe/extend-expect";
import "vitest-canvas-mock";
import * as matchers from "vitest-axe/matchers";
import { expect } from "vitest";
expect.extend(matchers);
