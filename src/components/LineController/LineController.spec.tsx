import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { LineController } from ".";

describe("LineController component", () => {
  let jsx = (
    <table>
      <tbody>
        <tr>
          <LineController
            description="Did work"
            onCancel={jest.fn()}
            onSave={jest.fn()}
          />
        </tr>
      </tbody>
    </table>
  );

  it("should render", () => {
    const { container } = render(jsx);
    expect(container).toMatchInlineSnapshot(`
      <div>
        <table>
          <tbody>
            <tr>
              <td
                class="pl-8 pt-3 pb-3"
              >
                Did work
              </td>
              <td
                class="text-right"
              >
                 days
              </td>
              <td
                class="text-right"
              >
                $0.00
              </td>
              <td
                class="text-right pr-8"
              >
                $0.00
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `);
  });
});
