import React, { PureComponent } from 'react';
// import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Group A', value: 200 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>

    </g>
  );
};

export default class Example extends PureComponent {
  static demoUrl = 'https://codesandbox.io/s/pie-chart-with-customized-active-shape-y93si';

  state = {
    activeIndex: 0,
  };

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  render() {
    return (
      // <ResponsiveContainer width="100%" height="100%">
      //   <PieChart width={400} height={400}>
      //     <Pie
      //       activeIndex={this.state.activeIndex}
      //       activeShape={renderActiveShape}
      //       data={data}
      //       cx="50%"
      //       cy="50%"
      //       innerRadius={60}
      //       outerRadius={200}
      //       fill="#7FFFD4"
      //       dataKey="value"
      //       onMouseEnter={this.onPieEnter}
      //     />
      //   </PieChart>
      // </ResponsiveContainer>
      <>
      </>
    );
  }
}
