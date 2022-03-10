import { mapGetters, mapState } from 'vuex'

const permission = {
  computed: {
    ...mapState(['Auth', 'Admin']),
    ...mapGetters(['VirtualSpace', 'Tenant', 'Project', 'Environment']),
    m_permisson_resourceAllow() {
      return (
        this.Auth.environments.findIndex((t) => {
          return t.id === this.Environment().ID && t.isAdmin
        }) > -1 ||
        this.Admin ||
        this.m_permisson_projectAllow ||
        this.m_permisson_tenantAllow
      )
    },
    m_permisson_projectAllow() {
      return (
        this.Auth.projects.findIndex((t) => {
          return t.id === this.Project().ID && (t.isAdmin || t.role === 'ops')
        }) > -1 ||
        this.Admin ||
        this.m_permisson_tenantAllow
      )
    },
    m_permisson_tenantAllow() {
      return (
        this.Auth.tenant.findIndex((t) => {
          return t.id === this.Tenant().ID && t.isAdmin
        }) > -1 || this.Admin
      )
    },
    m_permisson_virtualSpaceAllow() {
      return (
        this.Auth.virtualSpaces.findIndex((t) => {
          return t.isAdmin && t.id === this.VirtualSpace().ID
        }) > -1 || this.Admin
      )
    },
    m_permisson_resourceRole() {
      if (this.Admin) return 'sys'
      if (this.m_permisson_tenantRole === 'admin') return 'tenantadmin'
      if (this.m_permisson_projectRole === 'admin') return 'projectadmin'
      if (this.m_permisson_projectRole === 'ops') return 'projectops'
      const role = this.Auth.environments.find((t) => {
        return t.id === this.Environment().ID
      })
      if (role) {
        return role.role
      }
      return 'reader'
    },
    m_permisson_projectRole() {
      if (this.Admin) return 'sys'
      if (this.m_permisson_tenantRole === 'admin') return 'tenantadmin'
      const role = this.Auth.projects.find((t) => {
        return t.id === this.Project().ID
      })
      if (role) {
        return role.role
      }
      return ''
    },
    m_permisson_tenantRole() {
      if (this.Admin) return 'sys'
      const role = this.Auth.tenant.find((t) => {
        return t.id === this.Tenant().ID
      })
      if (role) {
        return role.role
      }
      return 'ordinary'
    },
    m_permisson_virtualSpaceRole() {
      if (this.Admin) return 'sys'
      const role = this.Auth.virtualSpaces.find((t) => {
        return t.id === this.VirtualSpace().ID
      })
      if (role) {
        return role.role
      }
      return 'normal'
    },
  },
}

export default permission
