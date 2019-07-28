import React from 'react'
import Helmet from 'react-helmet'
import { Layout } from '../components/layout'
import siteMeta from '../../custom/siteMeta'
import { Contact } from '../components/contact'

export default () => {
  return (
    <Layout>
      <>
        <Helmet title={`Contact - ${siteMeta.siteTitle}`} />
        <div>
          <Contact />
        </div>
      </>
    </Layout>
  )
}
