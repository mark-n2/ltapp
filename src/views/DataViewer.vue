<template>
  <div class="viewer">
		<v-layout row>
			<v-flex xs12 sm6 offset-sm3>
				<v-card>
					<v-toolbar dark>
						<v-toolbar-side-icon>
							<v-btn to="/">
								<v-icon>navigate_before</v-icon>
							</v-btn>
						</v-toolbar-side-icon>
						<v-toolbar-title>Data Viewer</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-toolbar-title>download:</v-toolbar-title>
						<v-btn icon @click="download">
							<v-icon>cloud_download</v-icon>
						</v-btn>
					</v-toolbar>
					<v-card v-if="records">
						<v-card-text>
							<h2>Data Table</h2>
						</v-card-text>
						<v-data-table :headers="headers" :items="records" class="elevation-1">
							<template v-slot:items="props">
								<td>{{ props.item.date }}</td>
								<td>{{ props.item.accX }}</td>
								<td>{{ props.item.accY }}</td>
								<td>{{ props.item.accZ }}</td>
								<td>{{ props.item.gyro_beta }}</td>
								<td>{{ props.item.gyro_gamma }}</td>
								<td>{{ props.item.gyro_alpha }}</td>
							</template>
						</v-data-table>
					</v-card>
					<v-progress-circular v-else indeterminate color="primary">
					</v-progress-circular>
				</v-card>
			</v-flex>
		</v-layout>
  </div>
</template>

<script>
export default {
	data () {
		return {
		records: [],
		headers: [
				{ text:'date', value: 'date' },
				{ text:'加速度X', value: 'accX'},
				{ text:'加速度Y', value: 'accY'},
				{ text:'加速度Z', value: 'accZ'},
				{ text:'ジャイロX', value: 'gyro_beta'},
				{ text:'ジャイロY', value: 'gyro_gamma'},
				{ text:'ジャイロZ', value: 'gyro_alpha'},
			]
		}
	},
	methods: {
		download () {
			// CSVに保存
			var csv = '\ufeff' + 'date,加速度X,加速度Y,加速度Z,ジャイロX,ジャイロY,ジャイロZ\n'
			this.records.forEach(el => {
				var line = el['date'] + ',' + el['accX'] + ',' + el['accY'] + ',' + el['accZ'] + ',' + el['gyro_beta'] + ',' + el['gyro_gamma'] + ',' + el['gyro_alpha'] + '\n'
				csv += line
			})
			if(navigator.share) {
				navigator.share({
					title: 'records_' + this.$route.params.id,
					text: csv
				})
			}
			else {
				let blob = new Blob([csv], { type: 'text/csv'})
				let link = document.createElement('a')
				link.href = window.URL.createObjectURL(blob)
				link.download = 'records_' + this.$route.params.id + '.csv'
				link.click()
			}
		}
	},
	async created () {
		console.log('viewer id:', this.$route.params.id)
		this.records = await this.db.data.where('no').equals(this.$route.params.id).toArray()
	}
}
</script>