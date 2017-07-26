import React from 'react'
import { Switch, Route } from 'react-router-dom'
import SRSingle_IT from '../components/imageAndTool/SRSingle_IT';
import Lens_IT from '../components/imageAndTool/Lens_IT';

const WorkSpace = () => (
  <main>
    <Switch>
      <Route exact path='/demo/' component={SRSingle_IT}/>
      <Route path='/demo/DepthNormal' component={Lens_IT}/>
    </Switch>
  </main>
)

export default WorkSpace
